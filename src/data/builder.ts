import type { ShowCourseTabPayload } from "~background";
import { fetchNebulaCourse, fetchNebulaProfessor, fetchNebulaSections } from "./fetch";
import { requestProfessorsFromRmp } from "~data/fetchFromRmp";
import { SCHOOL_ID } from "./config";

interface ProfessorProfileInterface {
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

export async function buildProfessorProfiles (payload: ShowCourseTabPayload) {
  const { header, professors } = payload;
  const nebulaCourse = await fetchNebulaCourse(header)
  const nebulaProfessors = await Promise.all(professors.map(professor => {
    const nameArray = professor.split(' ')
    const firstName = nameArray[0]
    const lastName = nameArray[nameArray.length - 1]
    return fetchNebulaProfessor({ firstName: firstName, lastName: lastName})
  }))
  const nebulaSections = await Promise.all(nebulaProfessors.map(professor => {
    if (professor?._id === undefined) return null
    return fetchNebulaSections({ courseReference: nebulaCourse._id, professorReference: professor._id })
  }))
  const rmps = await requestProfessorsFromRmp({ professorNames: nebulaProfessors.map(prof => prof?.first_name + " " + prof?.last_name), schoolId: SCHOOL_ID })
  let professorProfiles: ProfessorProfileInterface[] = []
  for (let i = 0; i < professors.length; i++) {
    professorProfiles.push({
      name: professors[i],
      profilePicUrl: nebulaProfessors[i]?.image_uri,
      rmpId: rmps[i]?.legacyId,
      rmpScore: rmps[i]?.avgRating,
      diffScore: rmps[i]?.avgDifficulty,
      wtaScore: rmps[i]?.wouldTakeAgainPercent,
      rmpTags: rmps[i]?.teacherRatingTags.sort((a, b) => a.tagCount - b.tagCount).map(tag => tag.tagName),
      gradeDistributions: nebulaSections[i] ? nebulaSections[i].map(section => ({ name: [nebulaCourse.subject_prefix, nebulaCourse.course_number, section.section_number, section.academic_session.name].join(' '), series: [{name: "Students", data: section.grade_distribution}] })) : [{name: "No Data", series: [{name: "Students", data: []}]}],
      ratingsDistribution: rmps[i] ? Object.values(rmps[i].ratingsDistribution).reverse().slice(1) : []
    })
  }
  return professorProfiles
}