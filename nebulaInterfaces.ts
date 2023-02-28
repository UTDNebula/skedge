export interface fetchProfessor_params {
    firstName: string,
    lastName: string
};

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
