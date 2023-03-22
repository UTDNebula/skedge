import { HEADERS, PROFESSOR_QUERY } from "~data/config";

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
        let matched = false;
        const regex = /"legacyId":(\d+).*?"firstName":"(.*?)","lastName":"(.*?)"/g;
        for (const match of text.matchAll(regex)) {
            if (professorNames.includes(match[2].split(' ')[0] + " " + match[3])) {
                professorIds.push(match[1]);
                matched = true;
            }
        }
        if (!matched) professorIds.push(null)
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

function fetchWithGraphQl(graphQlUrlProps: any[], resolve) {
    const graphqlUrl = "https://www.ratemyprofessors.com/graphql";

    Promise.all(graphQlUrlProps.map(u=>fetch(graphqlUrl, u)))
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(ratings => {
            for (let i = 0; i < ratings.length; i++) {
                if (ratings[i] != null && ratings[i].hasOwnProperty("data") && ratings[i]["data"].hasOwnProperty("node")) {
                    ratings[i] = ratings[i]["data"]["node"];
                }
            }
            resolve(ratings)
        })
}

export interface RmpRequest {
    professorNames: string[],
    schoolId: string
}
export function requestProfessorsFromRmp(request: RmpRequest): Promise<RMPInterface[]> {
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

                    // create fetch objects for each professor id
                    const graphQlUrlProps = getGraphQlUrlProps(professorIds)

                    // fetch professor info by id with graphQL
                    fetchWithGraphQl(graphQlUrlProps, resolve)
                }
            ).catch(error => {
            console.log(error)
            reject(error);
        });

        console.log(Date.now() - startTime);
    })
}

interface RMPInterface {
    avgDifficulty: number;
    avgRating: number;
    courseCodes: {
        courseCount: number;
        courseName: string;
    }[];
    department: string;
    firstName: string;
    lastName: string;
    legacyId: number;
    numRatings: number;
    ratingsDistribution: { 
        r1: number; 
        r2: number; 
        r3: number; 
        r4: number; 
        r5: number;
        total: number;
    };
    school: {
        id: string;
    };
    teacherRatingTags: {
        tagCount: number;
        tagName: string;
    }[];
    wouldTakeAgainPercent: number;
}