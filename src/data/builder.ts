import type { ShowCourseTabPayload } from '~background';
import { requestProfessorFromRmp } from '~data/fetchFromRmp';

import { SCHOOL_ID } from './config';
import { fetchNebulaGrades, fetchNebulaProfessor } from './fetch';

export interface ProfessorProfileInterface {
  name: string;
  profilePicUrl: string;
  rmpId: number;
  rmpScore: number;
  diffScore: number;
  wtaScore: number;
  rmpTags: string[];
  gradeDistributions: GradeDistribution[];
  ratingsDistribution: number[];
}

interface GradeDistribution {
  name: string;
  series: ApexAxisChartSeries;
}

function combineAndNormalizeGrades(gradeData) {
  const totalGrades = [];

  //combine academic sections
  gradeData = gradeData.map((professor) =>
    professor === null
      ? null
      : professor.reduce(
          (accumulator, academicSession) => {
            return accumulator.map(
              (value, index) =>
                value + academicSession.grade_distribution[index] ?? 0,
            );
          },
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ),
  );

  //divide by total
  gradeData = gradeData.map((professor) => {
    if (professor === null) {
      totalGrades.push(0);
      return null;
    }
    const total = professor.reduce(
      (accumulator, grade) => grade + accumulator,
      0,
    );
    totalGrades.push(total);
    return professor.map((grade) => (grade / total) * 100);
  });

  return [totalGrades, gradeData];
}

export async function buildProfessorProfiles(payload: ShowCourseTabPayload) {
  let { professors } = payload;
  professors = professors.map((prof) => {
    const parts = prof.split(' ');
    return {
      profFirst: parts[0],
      profLast: parts[parts.length - 1],
    };
  });

  let nebulaProfessors, nebulaGrades, rmps;

  const nebulaProfessorsPromises = Promise.all(
    professors.map(fetchNebulaProfessor),
  ).then((result) => (nebulaProfessors = result));

  const nebulaGradesPromises = Promise.all(
    professors.map(fetchNebulaGrades),
  ).then((result) => (nebulaGrades = result));

  const rmpsPromises = Promise.all(
    professors.map((prof) =>
      requestProfessorFromRmp({
        professorName: prof.profFirst + ' ' + prof.profLast,
        schoolId: SCHOOL_ID,
      }),
    ),
  ).then((result) => (rmps = result));

  await Promise.all([
    nebulaProfessorsPromises,
    nebulaGradesPromises,
    rmpsPromises,
  ]);

  let totalGrades = [];
  [totalGrades, nebulaGrades] = combineAndNormalizeGrades(nebulaGrades);

  const professorProfiles: ProfessorProfileInterface[] = [];
  for (let i = 0; i < professors.length; i++) {
    professorProfiles.push({
      name: professors[i].profFirst + ' ' + professors[i].profLast,
      profilePicUrl: nebulaProfessors[i]?.image_uri,
      rmpId: rmps[i]?.legacyId,
      rmpScore: rmps[i]?.avgRating
        ? rmps[i]?.avgRating === 0
          ? undefined
          : rmps[i]?.avgRating
        : undefined,
      diffScore: rmps[i]?.avgDifficulty
        ? rmps[i].avgDifficulty === 0
          ? undefined
          : rmps[i]?.avgDifficulty
        : undefined,
      wtaScore: rmps[i]?.wouldTakeAgainPercent
        ? rmps[i]?.wouldTakeAgainPercent === -1
          ? undefined
          : rmps[i]?.wouldTakeAgainPercent
        : undefined,
      rmpTags: rmps[i]?.teacherRatingTags
        .sort((a, b) => b.tagCount - a.tagCount)
        .map((tag) => tag.tagName),
      gradeDistribution: [
        {
          name: professors[i].profFirst + ' ' + professors[i].profLast,
          data: nebulaGrades[i] ?? [],
        },
      ],
      totalGrades: totalGrades[i],
      ratingsDistribution: rmps[i]
        ? Object.values(rmps[i].ratingsDistribution).reverse().slice(1)
        : [],
      totalRatings: rmps[i]?.ratingsDistribution?.total ?? 0,
    });
  }
  return professorProfiles;
}
