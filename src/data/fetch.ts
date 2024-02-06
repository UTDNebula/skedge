import { NEBULA_FETCH_OPTIONS } from '~data/config';
import type {
  CourseInterface,
  FetchCourseParameters,
  FetchProfessorParameters,
  FetchSectionParameters,
  ProfessorInterface,
  SectionInterface,
} from '~data/interfaces';

export async function fetchNebulaCourse(
  params: FetchCourseParameters,
): Promise<CourseInterface> | null {
  try {
    const res = await fetch(
      `https://api.utdnebula.com/course?course_number=${params.courseNumber}&subject_prefix=${params.subjectPrefix}`,
      NEBULA_FETCH_OPTIONS,
    );
    const json = await res.json();
    if (json.data == null) throw new Error('Null data');
    const data: CourseInterface = json.data[0];
    return data;
  } catch (error) {
    return null;
  }
}

export async function fetchNebulaProfessor(
  params: FetchProfessorParameters,
): Promise<ProfessorInterface> | null {
  try {
    const res = await fetch(
      `https://api.utdnebula.com/professor?first_name=${params.firstName}&last_name=${params.lastName}`,
      NEBULA_FETCH_OPTIONS,
    );
    const json = await res.json();
    if (json.data == null) throw new Error('Null data');
    const data: ProfessorInterface = json.data[0];
    return data;
  } catch (error) {
    return null;
  }
}

export async function fetchNebulaSections(
  params: FetchSectionParameters,
): Promise<SectionInterface[]> | null {
  try {
    const res = await fetch(
      `https://api.utdnebula.com/section?course_reference=${params.courseReference}&professors=${params.professorReference}`,
      NEBULA_FETCH_OPTIONS,
    );
    const json = await res.json();
    if (json.data == null) throw new Error('Null data');
    const data: SectionInterface[] = json.data;
    return data;
  } catch (error) {
    return null;
  }
}

// Test function. Commented out. Uncomment to test.
// console.log(await fetchNebulaCourse({courseNumber: "4337", subjectPrefix: "CS"}));
// console.log(await fetchNebulaProfessor({firstName: "Scott", lastName: "Dollinger"}));
// console.log(await fetchNebulaSections({ courseReference: "623fedfabf28b6d88d6c7742", professorReference: "623fc346b8bc16815e8679a9" }))
