export interface fetchProfessor_params {
    firstName: string,
    lastName: string
};

export interface fetchCourse_params {
    subjectPrefix: string,
    courseNumber: string
}

export interface requisites {
    options: Array<any>,
    required: number,
    type: string
}

export interface courseData {
    __v: number,
    _id: string,
    activity_type: string,
    class_level: string,
    co_or_pre_requisites: requisites,
    corequisites: requisites,
    course_number: string,
    credit_hours: string,
    description: string,
    grading: string,
    internal_course_number: string,
    laboratory_contact_hours: string,
    lecture_contact_hours: string,
    offering_frequency: string,
    prerequisites: requisites,
    school: string,
    sections: Array<string>,
    subject_prefix: string,
    title: string,
}

export interface office {
    building: string,
    room: string,
    map_uri: string
}

export interface professorData {
    __v: number,
    _id: string,
    email: string,
    first_name: string,
    image_uri: string,
    last_name: string,
    office: office,
    office_hours: Array<any>,
    phone_number: string,
    profile_uri: string,
    sections: Array<string>,
    titles: Array<string>,
}
