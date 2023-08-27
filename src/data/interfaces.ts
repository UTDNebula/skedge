export interface FetchProfessorParameters {
  firstName: string;
  lastName: string;
};

export interface FetchCourseParameters {
  subjectPrefix: string;
  courseNumber: string;
}

export interface FetchSectionParameters {
  courseReference: string;
  professorReference: string;
};

interface Requisites {
  options: any[];
  required: number;
  type: string;
}

export interface CourseInterface {
  __v: number;
  _id: string;
  activity_type: string;
  class_level: string;
  co_or_pre_requisites: Requisites;
  corequisites: Requisites;
  course_number: string;
  credit_hours: string;
  description: string;
  grading: string;
  internal_course_number: string;
  laboratory_contact_hours: string;
  lecture_contact_hours: string;
  offering_frequency: string;
  prerequisites: Requisites;
  school: string;
  sections: string[];
  subject_prefix: string;
  title: string;
}

interface Office {
  building: string;
  room: string;
  map_uri: string
}

export interface ProfessorInterface {
  __v: number;
  _id: string;
  email: string;
  first_name: string;
  image_uri: string;
  last_name: string;
  office: Office;
  office_hours: any[];
  phone_number: string;
  profile_uri: string;
  sections: string[];
  titles: string[];
}

export interface SectionInterface {
  __v: number;
  _id: string;
  academic_session: {
    end_date: string;
    name: string;
    start_date: string;
  };
  attributes: any[];
  core_flags: any[];
  course_reference: string;
  grade_distribution?: number[];
  instruction_mode: string;
  internal_class_number: string;
  meetings: any[];
  professors: string[];
  section_corequisites: {
    options: any[];
    type: string;
  };
  section_number: string;
  syllabus_uri: string;
  teaching_assistants: any[];
};

export interface CourseCodeInterface {
  courseCount: number,
  courseName: string
};
export interface RatingsDistributionInterface {
  r1: number,
  r2: number,
  r3: number,
  r4: number,
  r5: number,
  total: number
};
export interface TeacherRatingTag {
  tagCount: number,
  tagName: string
}

export interface RMPRatingInterface {
  avgDifficulty: number,
  avgRating: number,
  courseCodes: CourseCodeInterface [],
  department: string,
  firstName: string,
  lastName: string,
  legacyId: number,
  numRatings: number,
  ratingsDistribution: RatingsDistributionInterface,
  school: {id: string},
  teacherRatingTags: TeacherRatingTag [],
  wouldTakeAgainPercent: number

}
