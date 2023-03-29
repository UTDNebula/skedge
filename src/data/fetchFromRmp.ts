import { HEADERS, PROFESSOR_QUERY, RMP_GRAPHQL_URL } from "~data/config";
import type { RMPRatingInterface } from "~data/interfaces";

function reportError(context, err) {
    console.error("Error in " + context + ": " + err);
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
    const lowerCaseProfessorNames = professorNames.map(name => name.toLowerCase())
    texts.forEach(text => {
        let pendingMatch = null;
        const regex = /"legacyId":(\d+).*?"numRatings":(\d+).*?"firstName":"(.*?)","lastName":"(.*?)"/g;
        let allMatches: string[] = text.match(regex);
        let highestNumRatings = 0;
        
        if (allMatches) {
            for (const fullMatch of allMatches) {
                for (const match of fullMatch.matchAll(regex)) {
                    console.log(match[3].split(' ')[0].toLowerCase() + " " + match[4].toLowerCase() + " ")
                    let numRatings = parseInt(match[2]);
                    if (lowerCaseProfessorNames.includes(match[3].split(' ')[0].toLowerCase() + " " + match[4].toLowerCase()) && numRatings >= highestNumRatings) {
                        pendingMatch = match[1];
                    }
                }
            }
        }
        
        professorIds.push(pendingMatch);
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

function wait(delay){
    return new Promise((resolve) => setTimeout(resolve, delay));
}

function fetchRetry(url: string, delay: number, tries: number, fetchOptions) {
    function onError(err){
        let triesLeft: number = tries - 1;
        if(!triesLeft){
            throw err;
        }
        return wait(delay).then(() => fetchRetry(url, delay, triesLeft, fetchOptions));
    }
    return fetch(url,fetchOptions).catch(onError);
}

// Function to group a list of items into groups of a certain size.
// For example, groupProps([1,2,3,4,5,6,7,8,9], 3) returns [[1,2,3], [4,5,6], [7,8,9]]
function groupProps(props: any[], maxGroupSize: number): any[] {
    let groupedProps = [[]];
    
    // Iterate all entries in the props list. (Could be an array or an Object)
    for (const [key, value] of Object.entries(props)) {
        let lastGroup: any[] = groupedProps[groupedProps.length - 1];
        if (lastGroup.length < maxGroupSize) {
            // If there are less than 3 items in the last group, add the current item to the last group.
            lastGroup.push(value);
        }
        else {
            // Otherwise, make a new group and add the current item to it.
            groupedProps.push([value]);
        }
    };
    return groupedProps;
  }
  
  export async function fetchWithGraphQl(graphQlUrlProps: any[]) {
    try {
        let groupedProps = groupProps(graphQlUrlProps, 3); // Group our fetches into groups of 3.
        let responses: any[] = [];

        // Here, we iterate through each group of fetches, one at a time.
        for (let i = 0; i < groupedProps.length; i++) {
            // Wait for all fetches in the current group to finish.
            let smallGroup = await Promise.all(groupedProps[i].map(u=>fetch(RMP_GRAPHQL_URL, u)));

            // Now that we have all the responses, we can iterate through them and add them to the responses array.
            for (let j = 0; j < smallGroup.length; j++) {
                responses.push(smallGroup[j]);
            }
        }

        // We now have all the responses. So, we consider all the responses, and collect the ratings.
        let ratings: RMPRatingInterface [] = await Promise.all(responses.map(res => res.json()));
        for (let i = 0; i < ratings.length; i++) {
            if (ratings[i] != null && ratings[i].hasOwnProperty("data") && ratings[i]["data"].hasOwnProperty("node")) {
                ratings[i] = ratings[i]["data"]["node"];
            }
        }
        return ratings;
    }
    catch (err) {
       reportError("fetchWithGraphQl",err);
       return [];
    }
  }

export interface RmpRequest {
    professorNames: string[],
    schoolId: string
}
export async function requestProfessorsFromRmp(request: RmpRequest): Promise<RMPInterface[]> {

    // make a list of urls for promises
    const professorUrls = getProfessorUrls(request.professorNames, request.schoolId)
    
    // fetch professor ids from each url
    try {
        let responses = await Promise.all(professorUrls.map(u=>(fetch(u))));
        for (const [key, value] of Object.entries(responses)) {
            let notOk = value?.status !== 200;
            if (notOk && value && value.url) {
                reportError("requestProfessorsFromRmp", "Status not OK for fetch request.");
                responses[key] = await fetchRetry(value?.url, 200, 3, {});
            }
        };
        // let responses = await Promise.all(professorUrls.map(u=>fetchRetry(u, 500, 3, {})));
        let texts = await Promise.all(responses.map(res => res.text()));
        const professorIds = getProfessorIds(texts, request.professorNames)

        // create fetch objects for each professor id
        const graphQlUrlProps = getGraphQlUrlProps(professorIds)

        // fetch professor info by id with graphQL
        let professors = await fetchWithGraphQl(graphQlUrlProps);
        return professors;
    } catch (error) {
        reportError("requestProfessorsFromRmp", error);\
        return [];
    };
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