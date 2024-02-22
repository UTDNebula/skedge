import { HEADERS, PROFESSOR_QUERY, RMP_GRAPHQL_URL } from '~data/config';

function reportError(context, err) {
  console.error('Error in ' + context + ': ' + err);
}

function getProfessorUrl(professorName: string, schoolId: string): string {
  const url = new URL(
    'https://www.ratemyprofessors.com/search/professors/' + schoolId + '?',
  ); //UTD
  url.searchParams.append('q', professorName);
  return url.href;
}

function getProfessorId(text: string, professorName: string): string {
  const lowerCaseProfessorName = professorName.toLowerCase();

  let pendingMatch = null;
  const regex =
    /"legacyId":(\d+).*?"numRatings":(\d+).*?"firstName":"(.*?)","lastName":"(.*?)"/g;
  const allMatches: string[] = text.match(regex);
  const highestNumRatings = 0;

  if (allMatches) {
    for (const fullMatch of allMatches) {
      for (const match of fullMatch.matchAll(regex)) {
        console.log(
          match[3].split(' ')[0].toLowerCase() +
            ' ' +
            match[4].toLowerCase() +
            ' ',
        );
        const numRatings = parseInt(match[2]);
        if (
          lowerCaseProfessorName.includes(
            match[3].split(' ')[0].toLowerCase() + ' ' + match[4].toLowerCase(),
          ) &&
          numRatings >= highestNumRatings
        ) {
          pendingMatch = match[1];
        }
      }
    }
  }

  return pendingMatch;
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

function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function fetchRetry(url: string, delay: number, tries: number, fetchOptions) {
  function onError(err) {
    const triesLeft: number = tries - 1;
    if (!triesLeft) {
      throw err;
    }
    return wait(delay).then(() =>
      fetchRetry(url, delay, triesLeft, fetchOptions),
    );
  }
  return fetch(url, fetchOptions).catch(onError);
}

async function validateResponse(response, fetchOptions) {
  const notOk = response?.status !== 200;
  if (notOk && response && response.url) {
    const details = {
      status: response.status,
      statusText: response.statusText,
      redirected: response.redirected,
      url: response.url,
    };
    reportError(
      'validateResponse',
      'Status not OK for fetch request. Details are: ' +
        JSON.stringify(details),
    );
    // If we don't have fetch options, we just use an empty object.
    response = await fetchRetry(response?.url, 200, 3, fetchOptions || {});
  }
  return response;
}

function fetchWithGraphQl(graphQlUrlProp, resolve) {
  try {
    fetch(RMP_GRAPHQL_URL, graphQlUrlProp).then((response) =>
      validateResponse(response, graphQlUrlProp)
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
        }),
    );
  } catch (err) {
    reportError('fetchWithGraphQl', err);
    resolve(null); ///
  }
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
        reportError('requestProfessorFromRmp', error);
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
