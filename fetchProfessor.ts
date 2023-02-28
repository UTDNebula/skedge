
import fetch from "node-fetch";

// TO RUN, RUN THIS WITH 
// ts-node-esm fetchProfessor.ts

interface fetchParams {
    firstName: string,
    lastName: string
};

interface office {
    building: string,
    room: string,
    map_uri: string
}

interface professorData {
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


// Hash function to get the API key
function unRegister(myVar)
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
let NEBULA_API_KEY = "EM~eW}G<}4qx41fp{H=I]OZ5MF6T:1x{<GF:~v<";

// Helper function to fetch data from Nebula API. Returns a promise.
function fetchHelper(paramsObj: fetchParams) {
    const headers = {
        "x-api-key": unRegister(NEBULA_API_KEY),
        Accept: "application/json",
    };
    const getDataPromise = new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(
                `https://api.utdnebula.com/professor?first_name=${paramsObj.firstName}&last_name=${paramsObj.lastName}`,
                {
                    method: "GET",
                    headers: headers,
                }
            );
            resolve(res.json());
        } catch (err) {
            console.log("Error getting data: " + err);
            reject(null);
        }
    });

    return getDataPromise;
}

// Function to extract data from the fetch. Returns a promise.
function getNebulaProfessor(paramsObj: fetchParams) {
    const profPromise = new Promise<professorData> ((resolve, reject) => {
        fetchHelper(paramsObj).then((data: any) => {
            if (data?.data) {
                let newData: professorData = data.data;
                resolve(newData);
            }
            else {
                reject(null);
            }
        });
    });  
    return profPromise;
}

// Test function. Commented out. Uncomment to test.
// console.log(await getNebulaProfessor({firstName: "Scott", lastName: "Dollinger"}));