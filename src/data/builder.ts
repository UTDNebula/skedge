import type { ShowCourseTabPayload } from '~background';
import { requestProfessorsFromRmp } from '~data/fetchFromRmp';

import { SCHOOL_ID } from './config';
import {
  fetchNebulaCourse,
  fetchNebulaProfessor,
  fetchNebulaSections,
} from './fetch';

export interface ProfessorProfileInterface {
  name: string;
  profilePicUrl: string;
  rmpId: number;
  rmpScore: number;
  diffScore: number;
  wtaScore: number;
  rmpTags: string[];
  gradeDistributions: GradeDistribution[];
  ratingsDistribution: number[]; // temp
}

interface GradeDistribution {
  name: string;
  series: ApexAxisChartSeries;
}

const compareArrays = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export async function buildProfessorProfiles(payload: ShowCourseTabPayload) {
  const { header, professors } = payload;
  const nebulaCourse = await fetchNebulaCourse(header);
  const nebulaProfessors = await Promise.all(
    professors.map((professor) => {
      const nameArray = professor.split(' ');
      const firstName = nameArray[0];
      const lastName = nameArray[nameArray.length - 1];
      return fetchNebulaProfessor({ firstName: firstName, lastName: lastName });
    }),
  );
  const nebulaSections = await Promise.all(
    nebulaProfessors.map((professor) => {
      if (professor?._id === undefined) return null;
      return fetchNebulaSections({
        courseReference: nebulaCourse._id,
        professorReference: professor._id,
      });
    }),
  );
  const rmps = await requestProfessorsFromRmp({
    professorNames: professors.map(
      (prof) => prof.split(' ')[0] + ' ' + prof.split(' ').at(-1),
    ),
    schoolId: SCHOOL_ID,
  });
  const professorProfiles: ProfessorProfileInterface[] = [];
  for (let i = 0; i < professors.length; i++) {
    const sectionsWithGrades = [];
    for (let j = 0; j < nebulaSections[i]?.length; j++) {
      const section = nebulaSections[i][j];
      if (
        section.grade_distribution.length !== 0 &&
        !compareArrays(section.grade_distribution, Array(14).fill(0))
      )
        sectionsWithGrades.push(section);
    }
    professorProfiles.push({
      name: professors[i],
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
        .sort((a, b) => a.tagCount - b.tagCount)
        .map((tag) => tag.tagName),
      gradeDistributions:
        sectionsWithGrades.length > 0
          ? sectionsWithGrades.map((section) => ({
              name: [
                nebulaCourse.subject_prefix,
                nebulaCourse.course_number,
                section.section_number,
                section.academic_session.name,
              ].join(' '),
              series: [{ name: 'Students', data: section.grade_distribution }],
            }))
          : [{ name: 'No Data', series: [{ name: 'Students', data: [] }] }],
      ratingsDistribution: rmps[i]
        ? Object.values(rmps[i].ratingsDistribution).reverse().slice(1)
        : [],
    });
  }
  return professorProfiles;
}
