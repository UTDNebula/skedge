import { SCHOOL_ID, SCHOOL_NAME, TRENDS_URL } from '~data/config';
import fetchFromRmp, { type RMPInterface } from '~data/fetchFromRmp';
import fetchWithCache, {
  cacheIndexGrades,
  expireTime,
} from '~data/fetchWithCache';
import { type GradesData, type GradesType } from '~types/GradesType';
import { type SearchQuery } from '~types/SearchQuery';

//Find GPA, total, and grade_distribution based on including some set of semesters
function calculateGrades(grades: GradesData, academicSessions?: string[]) {
  let grade_distribution = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const session of grades) {
    if (
      typeof academicSessions === 'undefined' ||
      academicSessions.includes(session._id)
    ) {
      grade_distribution = grade_distribution.map(
        (item, i) => item + session.grade_distribution[i],
      );
    }
  }

  const total: number = grade_distribution.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  const GPALookup = [
    4, 4, 3.67, 3.33, 3, 2.67, 2.33, 2, 1.67, 1.33, 1, 0.67, 0,
  ];
  let mean_gpa = -1;
  if (total !== 0) {
    mean_gpa =
      GPALookup.reduce(
        (accumulator, currentValue, index) =>
          accumulator + currentValue * grade_distribution[index],
        0,
      ) /
      (total - grade_distribution[grade_distribution.length - 1]);
  }

  let median_gpa = -1;
  let medianIndex = -1;
  if (total != 0) {
    let i = Math.floor(total / 2);
    while (i > 0) {
      medianIndex++;
      i -= grade_distribution[medianIndex];
    }
    median_gpa = GPALookup[medianIndex];
  }

  return {
    mean_gpa: mean_gpa,
    gpa: median_gpa,
    total: total,
    grade_distribution: grade_distribution,
  };
}

//Fetch grades by academic session from nebula api
export function fetchGradesData(course: SearchQuery): Promise<GradesType> {
  return fetchWithCache(
    TRENDS_URL +
      'api/grades?' +
      Object.keys(course)
        .map(
          (key) =>
            key +
            '=' +
            encodeURIComponent(String(course[key as keyof SearchQuery])),
        )
        .join('&'),
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
    cacheIndexGrades,
    expireTime,
  ).then((response: { message: string; data: GradesData }) => {
    if (response.message !== 'success') {
      throw new Error(response.message);
    }
    if (response.data == null) {
      throw new Error('null data');
    }
    return {
      ...calculateGrades(response.data),
      grades: response.data, //type GradesData
    };
  });
}

//Fetch RMP data from RMP
export function fetchRmpData(professor: SearchQuery): Promise<RMPInterface> {
  return fetchFromRmp(
    professor.profFirst,
    professor.profLast,
    SCHOOL_ID,
    SCHOOL_NAME,
  ).then((response) => {
    if (typeof response === 'string') {
      throw new Error(response);
    }
    if (response.message !== 'success') {
      throw new Error(response.message);
    }
    return response.data;
  });
}
