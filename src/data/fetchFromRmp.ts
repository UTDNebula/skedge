import { HEADERS, PROFESSOR_SEARCH_QUERY, RMP_GRAPHQL_URL } from '~data/config';
import fetchWithCache, {
  cacheIndexRmp,
  expireTime,
} from '~data/fetchWithCache';

function getGraphQlUrlProp(name: string, schoolID: string) {
  PROFESSOR_SEARCH_QUERY.variables.query.text = name;
  PROFESSOR_SEARCH_QUERY.variables.query.schoolID = btoa('School-' + schoolID);
  return {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(PROFESSOR_SEARCH_QUERY),
  };
}

export type RMPInterface = {
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
};

type Data = {
  message: string;
  data?: RMPInterface;
};

export default function fetchFromRmp(
  profFirst: string,
  profLast: string,
  schoolId: string,
  schoolName: string,
): Promise<Data> {
  const singleProfFirst = profFirst.split(' ')[0];
  const name = singleProfFirst + ' ' + profLast;
  // create fetch object for professor
  const graphQlUrlProp = getGraphQlUrlProp(name, schoolId);
  return new Promise((resolve, reject) => {
    // fetch professor info by name with graphQL
    fetchWithCache(RMP_GRAPHQL_URL, graphQlUrlProp, cacheIndexRmp, expireTime)
      .then((response) => {
        if (
          response == null ||
          !Object.hasOwn(response, 'data') ||
          !Object.hasOwn(response.data, 'newSearch') ||
          !Object.hasOwn(response.data.newSearch, 'teachers') ||
          !Object.hasOwn(response.data.newSearch.teachers, 'edges')
        ) {
          reject({ message: 'Data for professor not found' });
          return;
        }
        //Remove profs not at UTD and with bad name match
        const professors = response.data.newSearch.teachers.edges.filter(
          (prof: { node: RMPInterface }) =>
            prof.node.school.name === schoolName &&
            prof.node.firstName.includes(profFirst) &&
            prof.node.lastName.includes(profLast),
        );
        if (professors.length === 0) {
          reject({ message: 'Data for professor not found' });
          return;
        }
        //Pick prof instance with most ratings
        let maxRatingsProfessor = professors[0];
        for (let i = 1; i < professors.length; i++) {
          if (
            professors[i].node.numRatings > maxRatingsProfessor.node.numRatings
          ) {
            maxRatingsProfessor = professors[i];
          }
        }
        resolve({
          message: 'success',
          data: maxRatingsProfessor.node,
        });
      })
      .catch((error) => {
        reject({ message: error.message });
      });
  });
}
