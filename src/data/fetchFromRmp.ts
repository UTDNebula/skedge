import { HEADERS, PROFESSOR_QUERY, RMP_GRAPHQL_URL } from "~data/config";
import type { RMPRatingInterface } from "~data/interfaces";

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

export interface RmpRequest {
    professorNames: string[],
    schoolId: string
}
export async function requestProfessorsFromRmp(request: RmpRequest): Promise<RMPInterface[]> {

    // make a list of urls for promises
    const professorUrls = getProfessorUrls(request.professorNames, request.schoolId)
    
    // fetch professor ids from each url
    try {
        let responses = await Promise.all(professorUrls.map(u=>fetch(u)));
        let texts = await Promise.all(responses.map(res => res.text()));
        const professorIds = getProfessorIds(texts, request.professorNames)

        // create fetch objects for each professor id
        const graphQlUrlProps = getGraphQlUrlProps(professorIds)

        // fetch professor info by id with graphQL
        let professors = await RMP_GRAPHQL_URL(graphQlUrlProps);
        return professors;
    } catch (error) {
        console.error(error);
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