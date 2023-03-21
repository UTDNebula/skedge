export interface CourseHeader {
    subjectPrefix: string;
    courseNumber: string;
}

export interface ShowCourseTabPayload {
  courseData: CourseHeader;
  professors: string[];
}