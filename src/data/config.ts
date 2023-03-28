import type { RMPRatingInterface } from "~data/interfaces";
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

export const SCHOOL_ID = "1273"

function unRegister(key: string) {
  let newVar = "";
  for (var i = 0; i < key.length; i++) {
    let a = key.charCodeAt(i);
    a = ((a*2)-8)/2;
    newVar = newVar.concat(String.fromCharCode(a));
  }
  return newVar;
}

function groupProps(props: any[], maxGroupSize: number): any[] {
  let groupedProps = [[]];

  for (const [key, value] of Object.entries(props)) {
      let lastGroup = groupedProps[groupedProps.length - 1];
      if (lastGroup.length < maxGroupSize) {
          lastGroup.push(value);
      }
      else {
          groupedProps.push([value]);
      }
  };
  return groupedProps;
}

export async function RMP_GRAPHQL_URL(graphQlUrlProps: any[]) {
  const graphqlUrl = "https://www.ratemyprofessors.com/graphql";
  try {
      let groupedProps = groupProps(graphQlUrlProps, 3);
      let responses: any[] = [];
      for (let i = 0; i < groupedProps.length; i++) {
          // Our fetches need to be grouped in groups of 3 to avoid 504 errors.
          let smallGroup = await Promise.all(groupedProps[i].map(u=>fetch(graphqlUrl, u)))
          for (let j = 0; j < smallGroup.length; j++) {
              responses.push(smallGroup[j]);
          }
      }
      let ratings: RMPRatingInterface [] = await Promise.all(responses.map(res => res.json()));
      for (let i = 0; i < ratings.length; i++) {
          if (ratings[i] != null && ratings[i].hasOwnProperty("data") && ratings[i]["data"].hasOwnProperty("node")) {
              ratings[i] = ratings[i]["data"]["node"];
          }
      }
      return ratings;
  }
  catch (err) {
     console.error(err);
     return [];
  }
}