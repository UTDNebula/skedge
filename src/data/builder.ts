import { CourseHeader } from '~content';
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
  loading: boolean;
}

interface GradeDistribution {
  name: string;
  series: ApexAxisChartSeries;
}

export async function buildProfessorProfile(
  header: CourseHeader,
  professor: string,
): ProfessorProfileInterface {
  const parts = professor.split(' ');
  const professorSplit = {
    profFirst: parts[0],
    profLast: parts[parts.length - 1],
  };

  let nebulaProfessor, nebulaGrades, rmp;

  const nebulaProfessorsPromise = fetchNebulaProfessor(professorSplit).then(
    (result) => (nebulaProfessor = result),
  );

  const nebulaGradesPromise = fetchNebulaGrades(professorSplit).then(
    (result) => (nebulaGrades = result),
  );

  const rmpsPromise = requestProfessorFromRmp({
    professorName: professorSplit.profFirst + ' ' + professorSplit.profLast,
    schoolId: SCHOOL_ID,
  }).then((result) => (rmp = result));

  await Promise.all([
    nebulaProfessorsPromise,
    nebulaGradesPromise,
    rmpsPromise,
  ]);

  let totalGrades = 0;
  if (nebulaGrades !== null) {
    //combine academic sections
    nebulaGrades = nebulaGrades.reduce(
      (accumulator, academicSession) => {
        return accumulator.map(
          (value, index) =>
            value + academicSession.grade_distribution[index] ?? 0,
        );
      },
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    );

    //divide by total
    totalGrades = nebulaGrades.reduce(
      (accumulator, grade) => grade + accumulator,
      0,
    );
    nebulaGrades = nebulaGrades.map((grade) => (grade / totalGrades) * 100);
  }

  return {
    name: professor,
    profilePicUrl: nebulaProfessor?.image_uri,
    rmpId: rmp?.legacyId,
    rmpScore: rmp?.avgRating !== 0 ? rmp?.avgRating : undefined,
    diffScore: rmp?.avgDifficulty !== 0 ? rmp?.avgDifficulty : undefined,
    wtaScore:
      rmp?.wouldTakeAgainPercent !== -1
        ? rmp?.wouldTakeAgainPercent
        : undefined,
    rmpTags: rmp?.teacherRatingTags
      .sort((a, b) => a.tagCount - b.tagCount)
      .map((tag) => tag.tagName),
    gradeDistribution: [
      {
        name: professor,
        data: nebulaGrades ?? [],
      },
    ],
    totalGrades: totalGrades,
    ratingsDistribution: rmp
      ? Object.values(rmp.ratingsDistribution).reverse().slice(1)
      : [],
    totalRatings: rmp?.ratingsDistribution?.total ?? 0,
    loading: false,
  };
}
