import { HEADERS, PROFESSOR_QUERY, RMP_GRAPHQL_URL } from '~data/config';

function reportError(context, err) {
  console.error('Error in ' + context + ': ' + err);
}

function getProfessorUrl(professorName: string, schoolId: string): string {
  return `https://www.ratemyprofessors.com/search/professors/${schoolId}?q=${encodeURIComponent(
    professorName,
  )}}`;
}
function getProfessorUrls(
  professorNames: string[],
  schoolId: string,
): string[] {
  const professorUrls = [];
  for (let i = 0; i < professorNames.length; i++) {
    professorUrls.push(getProfessorUrl(professorNames[i], schoolId));
  }
  return professorUrls;
}

function getProfessorIds(texts: string[], professorNames: string[]): string[] {
  const professorIds = [];
  const lowerCaseProfessorNames = professorNames.map((name) =>
    name.toLowerCase(),
  );
  texts.forEach((text) => {
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
            lowerCaseProfessorNames.includes(
              match[3].split(' ')[0].toLowerCase() +
                ' ' +
                match[4].toLowerCase(),
            ) &&
            numRatings >= highestNumRatings
          ) {
            pendingMatch = match[1];
          }
        }
      }
    }

    professorIds.push(pendingMatch);
  });
  return professorIds;
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
function getGraphQlUrlProps(professorIds: string[]) {
  const graphQlUrlProps = [];
  professorIds.forEach((professorId) => {
    graphQlUrlProps.push(getGraphQlUrlProp(professorId));
  });
  return graphQlUrlProps;
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

// If using orderedFetchOpts, make sure that it is an array and that the index of the fetch options corresponds to the index of the response in the responses array.
async function validateResponses(responses, orderedFetchOpts) {
  for (const [key, value] of Object.entries(responses)) {
    const notOk = value?.status !== 200;
    if (notOk && value && value.url) {
      const details = {
        status: value.status,
        statusText: value.statusText,
        redirected: value.redirected,
        url: value.url,
      };
      reportError(
        'validateResponses',
        'Status not OK for fetch request. Details are: ' +
          JSON.stringify(details),
      );
      const fetchOptions = orderedFetchOpts[key] || {}; // If we don't have fetch options, we just use an empty object.
      responses[key] = await fetchRetry(value?.url, 200, 3, fetchOptions);
    }
  }
  return responses;
}

export async function fetchWithGraphQl(graphQlUrlProps) {
  try {
    const responses = await validateResponses(
      await Promise.all(graphQlUrlProps.map((u) => fetch(RMP_GRAPHQL_URL, u))),
      graphQlUrlProps,
    );
    // We now have all the responses. So, we consider all the responses, and collect the ratings.
    const ratings: RMPRatingInterface[] = await Promise.all(
      responses.map((res) => res.json()),
    );
    for (let i = 0; i < ratings.length; i++) {
      if (
        ratings[i] != null &&
        Object.prototype.hasOwnProperty.call(ratings[i], 'data') &&
        Object.prototype.hasOwnProperty.call(ratings[i]['data'], 'node')
      ) {
        ratings[i] = ratings[i]['data']['node'];
      }
    }
    return ratings;
  } catch (err) {
    reportError('fetchWithGraphQl', err);
    return [];
  }
}

export interface RmpRequest {
  professorNames: string[];
  schoolId: string;
}

export async function requestProfessorsFromRmp(
  request: RmpRequest,
): Promise<RMPInterface[]> {
  // make a list of urls for promises
  const professorUrls = getProfessorUrls(
    request.professorNames,
    request.schoolId,
  );

  // fetch professor ids from each url
  try {
    const responses = await validateResponses(
      await Promise.all(professorUrls.map((u) => fetch(u))),
      [],
    );

    const texts = await Promise.all(responses.map((res) => res.text()));
    const professorIds = getProfessorIds(texts, request.professorNames);

    // create fetch objects for each professor id
    const graphQlUrlProps = getGraphQlUrlProps(professorIds);

    // fetch professor info by id with graphQL
    const professors = await fetchWithGraphQl(graphQlUrlProps);
    return professors;
  } catch (error) {
    reportError('requestProfessorsFromRmp', error);
    return [];
  }
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
