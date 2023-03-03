import fetch from "node-fetch"

const HEADERS = {
    "Authorization": "Basic dGVzdDp0ZXN0",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    "Content-Type": "application/json"
}

const PROFESSOR_QUERY = {
    "query":"query RatingsListQuery($id: ID!) {node(id: $id) {... on Teacher {legacyId school {id} courseCodes {courseName courseCount} firstName lastName numRatings avgDifficulty avgRating department wouldTakeAgainPercent teacherRatingTags { tagCount tagName } ratingsDistribution { total r1 r2 r3 r4 r5 } }}}",
    "variables": {}
}

function getProfessorUrl(professorName: string, schoolId: string): string {
    return `https://www.ratemyprofessors.com/search/teachers?query=${encodeURIComponent(professorName)}&sid=${btoa(`School-${schoolId}`)}`
}
function getProfessorUrls(professorNames: string[], schoolId: string): string[] {
    const professorUrls = []
    for (let i = 0; i < professorNames.length; i++) {
        professorUrls.push(getProfessorUrl(professorNames[i], schoolId))
    }
    return professorUrls
}

function getProfessorIds(texts: string[], professorNames: string[]): string[] {
    const professorIds = []
    texts.forEach(text => {
        const regex = /"legacyId":(\d+).*?"firstName":"(\w+)","lastName":"(\w+)"/g;
        for (const match of text.matchAll(regex)) {
            if (professorNames.includes(match[2] + " " + match[3])) {
                professorIds.push(match[1]);
            }
        }
    })
    return professorIds
}

function getGraphQlUrlProp(professorId: string) {
    HEADERS["Referer"] = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${professorId}`
    PROFESSOR_QUERY["variables"]["id"] = btoa(`Teacher-${professorId}`)
    return {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(PROFESSOR_QUERY)
    }
}
function getGraphQlUrlProps(professorIds: string[]) {
    const graphQlUrlProps = []
    professorIds.forEach(professorId => {
        graphQlUrlProps.push(getGraphQlUrlProp(professorId))
    })
    return graphQlUrlProps
}

export interface RMPRequest {
    professorNames: string[],
    schoolId: string
}
export function requestProfessors(request: RMPRequest) {
    return new Promise((resolve, reject) => {
        console.log("Running request professors...")
        const startTime = Date.now();

        // make a list of urls for promises
        const professorUrls = getProfessorUrls(request.professorNames, request.schoolId)

        // fetch professor ids from each url
        Promise.all(professorUrls.map(u=>fetch(u)))
            .then(responses => Promise.all(responses.map(res => res.text())))
            .then(texts => {
                const professorIds = getProfessorIds(texts, request.professorNames)

                const graphqlUrl = "https://www.ratemyprofessors.com/graphql";

                // create fetch objects for each professor id
                const graphqlUrlProps = getGraphQlUrlProps(professorIds)

                // fetch professor info by id with graphQL
                Promise.all(graphqlUrlProps.map(u=>fetch(graphqlUrl, u))).then(responses =>
                    Promise.all(responses.map(res => res.json()))
                ).then(ratings => {
                    for (let i = 0; i < ratings.length; i++) {
                        if (ratings[i] != null && ratings[i].hasOwnProperty("data") && ratings[i]["data"].hasOwnProperty("node")) {
                            ratings[i] = ratings[i]["data"]["node"];
                        }
                    }

                    console.log(Date.now() - startTime);
                    resolve(ratings);
                })
            }
        ).catch(error => {
            console.log(error)
            reject(error);
        });
    })
}