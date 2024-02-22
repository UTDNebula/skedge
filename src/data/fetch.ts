interface FetchProfessorParameters {
  profFirst: string;
  profLast: string;
}

export async function fetchNebulaProfessor(
  params: FetchProfessorParameters,
): Promise<unknown> {
  return fetch(
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
  )
    .then((response) => response.json())
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
  return fetch(
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
  )
    .then((response) => response.json())
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
// console.log(await fetchNebulaCourse({courseNumber: "4337", subjectPrefix: "CS"}));
// console.log(await fetchNebulaProfessor({firstName: "Scott", lastName: "Dollinger"}));
// console.log(await fetchNebulaSections({ courseReference: "623fedfabf28b6d88d6c7742", professorReference: "623fc346b8bc16815e8679a9" }))
