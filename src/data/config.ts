export const HEADERS = {
  "Authorization": "Basic dGVzdDp0ZXN0",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
  "Content-Type": "application/json"
}

export const PROFESSOR_QUERY = {
  "query":"query RatingsListQuery($id: ID!) {node(id: $id) {... on Teacher {legacyId school {id} courseCodes {courseName courseCount} firstName lastName numRatings avgDifficulty avgRating department wouldTakeAgainPercent teacherRatingTags { tagCount tagName } ratingsDistribution { total r1 r2 r3 r4 r5 } }}}",
  "variables": {}
}

export const NEBULA_FETCH_OPTIONS = {
  method: "GET",
  headers: {
    "x-api-key": unRegister("EM~eW}G<}4qx41fp{H=I]OZ5MF6T:1x{<GF:~v<"),
    Accept: "application/json",
  },
}

function unRegister(key: string) {
  let newVar = "";
  for (var i = 0; i < key.length; i++) {
    let a = key.charCodeAt(i);
    a = ((a*2)-8)/2;
    newVar = newVar.concat(String.fromCharCode(a));
  }
  return newVar;
}

