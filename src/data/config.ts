export const HEADERS = {
  Authorization: 'Basic dGVzdDp0ZXN0',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
  'Content-Type': 'application/json',
};

export const PROFESSOR_QUERY = {
  query:
    'query RatingsListQuery($id: ID!) {node(id: $id) {... on Teacher {legacyId school {id} courseCodes {courseName courseCount} firstName lastName numRatings avgDifficulty avgRating department wouldTakeAgainPercent teacherRatingTags { tagCount tagName } ratingsDistribution { total r1 r2 r3 r4 r5 } }}}',
  variables: {},
};

export const SCHOOL_ID = '1273';
export const RMP_GRAPHQL_URL = 'https://www.ratemyprofessors.com/graphql';

export const neededOrigins = [
  'https://utdallas.collegescheduler.com/*',
  'https://www.ratemyprofessors.com/*',
  'https://trends.utdnebula.com/*',
];
