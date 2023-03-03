import type { fetchCourse_params, courseData, fetchProfessor_params, professorData } from "./nebulaInterfaces";

// Hash function to get the API key
function unRegister(myVar: string)
{
    let newVar = "";
    for (var i = 0; i < myVar.length; i++)
    {
        let a = myVar.charCodeAt(i);
        a = ((a*2)-8)/2;
        newVar = newVar.concat(String.fromCharCode(a));
    }
    return newVar;
}


// TESTING INFO
// Install ts-node locally
// add "type": "module" to package.json

// ts-node-esm fetch.ts




let NEBULA_API_KEY = "EM~eW}G<}4qx41fp{H=I]OZ5MF6T:1x{<GF:~v<";


const fetchOptions = {
    method: "GET",
    headers: {
        "x-api-key": unRegister(NEBULA_API_KEY),
        Accept: "application/json",
    },
}

// Helper function to fetch data from Nebula API. Returns a promise.

async function fetchNebulaCourse(paramsObj: fetchCourse_params): Promise<courseData> | null {
    try {
        const res = await fetch(`https://api.utdnebula.com/course?course_number=${paramsObj.courseNumber}&subject_prefix=${paramsObj.subjectPrefix}`, fetchOptions);
        const json = await res.json();
        if (json.data == null) throw new Error("Null data");
        const data: courseData = json.data[0];
        return data;
    } catch (error) {
        return null;
    }
}

async function fetchNebulaProfessor(paramsObj: fetchProfessor_params): Promise<professorData> | null {
    try {
        const res = await fetch(`https://api.utdnebula.com/professor?first_name=${paramsObj.firstName}&last_name=${paramsObj.lastName}`, fetchOptions);
        const json = await res.json();
        if (json.data == null) throw new Error("Null data");
        const data: professorData = json.data[0];
        return data;
    } catch (error) {
        return null;
    }
}

// Test function. Commented out. Uncomment to test.
console.log(await fetchNebulaCourse({courseNumber: "4337", subjectPrefix: "CS"}));
console.log(await fetchNebulaProfessor({firstName: "Scott", lastName: "Dollinger"}));