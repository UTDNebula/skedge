import fetchWithCache, {
  cacheIndexGrades,
  cacheIndexProfessor,
} from '~data/fetchWithCache';

interface FetchProfessorParameters {
  profFirst: string;
  profLast: string;
}

export async function fetchNebulaProfessor(
  params: FetchProfessorParameters,
): Promise<unknown> {
  return fetchWithCache(
    'https://trends.utdnebula.com/api/professor?profFirst=' +
      params.profFirst +
      '&profLast=' +
      params.profLast,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
    cacheIndexProfessor,
    2629800000,
  )
    .then((data) => {
      if (data.message !== 'success') {
        //throw new Error(data.message);
        return null;
      }
      return data.data;
    })
    .catch((error) => {
      console.error('Nebula API', error);
    });
}

export async function fetchNebulaGrades(
  params: FetchProfessorParameters,
): Promise<unknown> {
  return fetchWithCache(
    'https://trends.utdnebula.com/api/grades?profFirst=' +
      params.profFirst +
      '&profLast=' +
      params.profLast,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
    cacheIndexGrades,
    2629800000,
  )
    .then((data) => {
      if (data.message !== 'success') {
        throw new Error(data.message);
      }
      return data.data;
    })
    .catch((error) => {
      console.error('Nebula API', error);
    });
}

// Test function. Commented out. Uncomment to test.
// console.log(await fetchNebulaProfessor({profFirst: "Scott", profLast: "Dollinger"}));
