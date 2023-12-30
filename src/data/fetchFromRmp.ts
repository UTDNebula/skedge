import { HEADERS, PROFESSOR_QUERY } from '~data/config';

function getProfessorUrl(professorName: string, schoolId: string): string {
  const url = new URL(
    'https://www.ratemyprofessors.com/search/professors/' + schoolId + '?',
  ); //UTD
  url.searchParams.append('q', professorName);
  return url.href;
}

function getProfessorId(text: string, professorName: string): string {
  let professorId = '';
  const lowerCaseProfessorName = professorName.toLowerCase();

  let matched = false;
  const regex = /"legacyId":(\d+).*?"firstName":"(.*?)","lastName":"(.*?)"/g;
  for (const match of text.matchAll(regex)) {
    if (
      lowerCaseProfessorName.includes(
        match[2].split(' ')[0].toLowerCase() + ' ' + match[3].toLowerCase(),
      )
    ) {
      professorId = match[1];
      matched = true;
    }
  }
  if (!matched) professorId = null;

  return professorId;
}

function getGraphQlUrlProp(professorId: string) {
  HEADERS[
    'Referer'
  ] = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${professorId}`;
  PROFESSOR_QUERY['variables']['id'] = btoa(`Teacher-${professorId}`);
  return {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(PROFESSOR_QUERY),
  };
}

function fetchWithGraphQl(graphQlUrlProp, resolve) {
  const graphqlUrl = 'https://www.ratemyprofessors.com/graphql';

  fetch(graphqlUrl, graphQlUrlProp)
    .then((response) => response.json())
    .then((rating) => {
      if (
        rating != null &&
        Object.hasOwn(rating, 'data') &&
        Object.hasOwn(rating['data'], 'node')
      ) {
        rating = rating['data']['node'];
      }
      resolve(rating);
    });
}

export interface RmpRequest {
  professorName: string;
  schoolId: string;
}
export function requestProfessorFromRmp(
  request: RmpRequest,
): Promise<RMPInterface> {
  return new Promise((resolve, reject) => {
    // make a list of urls for promises
    const professorUrl = getProfessorUrl(
      request.professorName,
      request.schoolId,
    );

    // fetch professor ids from each url
    fetch(professorUrl)
      .then((response) => response.text())
      .then((text) => {
        const professorId = getProfessorId(text, request.professorName);

        // create fetch objects for each professor id
        const graphQlUrlProp = getGraphQlUrlProp(professorId);

        // fetch professor info by id with graphQL
        fetchWithGraphQl(graphQlUrlProp, resolve);
      })
      .catch((error) => {
        reject(error);
      });
  });
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
