export const HEADERS = {
  Authorization: 'Basic dGVzdDp0ZXN0',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
  'Content-Type': 'application/json',
  Referer: 'https://www.ratemyprofessors.com/',
};

export const PROFESSOR_SEARCH_QUERY = {
  query: `
    query TeacherSearchQuery($query: TeacherSearchQuery!) {
      newSearch {
        teachers(query: $query) {
          edges {
            node {
              id
              legacyId
              firstName
              lastName
              school {
                id
                name
              }
              department
              avgRating
              numRatings
              avgDifficulty
              wouldTakeAgainPercent
              teacherRatingTags {
                tagName
                tagCount
              }
              ratingsDistribution {
                total
                r1
                r2
                r3
                r4
                r5
              }
            }
          }
        }
      }
    }
  `,
  variables: {
    query: {
      text: '',
      schoolID: '',
    },
  },
};

export const SCHOOL_ID = '1273';
export const SCHOOL_NAME = 'The University of Texas at Dallas';

export const RMP_GRAPHQL_URL = 'https://www.ratemyprofessors.com/graphql';

export const neededOrigins = [
  'https://utdallas.collegescheduler.com/*',
  'https://www.ratemyprofessors.com/*',
  'https://trends.utdnebula.com/*',
];
