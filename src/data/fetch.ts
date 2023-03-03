const HEADERS = {
    "Authorization": "Basic dGVzdDp0ZXN0",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    "Content-Type": "application/json"
}

const PROFESSOR_QUERY = {
    "query":"query RatingsListQuery($id: ID!) {node(id: $id) {... on Teacher {legacyId school {id} courseCodes {courseName courseCount} firstName lastName numRatings avgDifficulty avgRating department wouldTakeAgainPercent teacherRatingTags { tagCount tagName } ratingsDistribution { total r1 r2 r3 r4 r5 } }}}",
    "variables": {}
}

export function requestProfessors(request) {
    return new Promise((resolve, reject) => {
        console.log("Running request professors...")

        var professorUrls = [];

        var startTime = Date.now();

        // make a list of urls for promises
        for (let i = 0; i < request.profNames.length; i++) {
            professorUrls.push(`https://www.ratemyprofessors.com/search/teachers?query=${encodeURIComponent(request.profNames[i])}&sid=${btoa(`School-${request.schoolId}`)}`);
        }

        // fetch professor ids from each url
        Promise.all(professorUrls.map(u=>fetch(u))).then(responses =>
            Promise.all(responses.map(res => res.text()))
        ).then(texts => {
                var profIds = [];

                texts.forEach(text => {
                    const regex = /"legacyId":(\d+).*?"firstName":"(\w+)","lastName":"(\w+)"/g;
                    for (const match of text.matchAll(regex)) {
                        if (request.profNames.includes(match[2] + " " + match[3])) {
                            profIds.push(match[1]);
                        }
                    }
                })

                var graphqlUrlProps = [];
                const graphqlUrl = "https://www.ratemyprofessors.com/graphql";

                // create fetch objects for each professor id
                profIds.forEach(professorID => {
                    HEADERS["Referer"] = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${professorID}`
                    PROFESSOR_QUERY["variables"]["id"] = btoa(`Teacher-${professorID}`)
                    graphqlUrlProps.push({
                        method: "POST",
                        headers: HEADERS,
                        body: JSON.stringify(PROFESSOR_QUERY)
                    })
                })

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