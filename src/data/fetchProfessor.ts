
import fetch from "node-fetch";
import type { fetchProfessor_params, professorData } from "./nebulaInterfaces.js";
import { unRegister } from "./removeLater.js";

// TO RUN, RUN THIS WITH 
// ts-node-esm fetchProfessor.ts

let NEBULA_API_KEY = "EM~eW}G<}4qx41fp{H=I]OZ5MF6T:1x{<GF:~v<";

// Helper function to fetch data from Nebula API. Returns a promise.
function fetchHelper(paramsObj: fetchProfessor_params) {
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
            reject(new Error(err));
        }
    });

    return getDataPromise;
}

// Function to extract data from the fetch. Returns a promise.
export function getNebulaProfessor(paramsObj: fetchProfessor_params) {
    const profPromise = new Promise<professorData> ((resolve, reject) => {
        fetchHelper(paramsObj).then((data: any) => {
            if (data?.data) {
                let newData: professorData = data.data;
                resolve(newData);
            }
            else {
                reject(new Error("No data found"));
            }
        });
    });  
    return profPromise;
}

// Test function. Commented out. Uncomment to test.
// console.log(await getNebulaProfessor({firstName: "Scott", lastName: "Dollinger"}));