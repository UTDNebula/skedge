
import fetch from "node-fetch";
import type { fetchCourse_params, courseData } from "./nebulaInterfaces.js";
import { unRegister } from "./removeLater.js";

// TO RUN, RUN THIS WITH 
// ts-node-esm fetchCourse.ts

let NEBULA_API_KEY = "EM~eW}G<}4qx41fp{H=I]OZ5MF6T:1x{<GF:~v<";

// Helper function to fetch data from Nebula API. Returns a promise.
function fetchHelper(paramsObj: fetchCourse_params) {
    const headers = {
        "x-api-key": unRegister(NEBULA_API_KEY),
        Accept: "application/json",
    };
    const getDataPromise = new Promise(async (resolve, reject) => {
        try {
            console.log("Params are ",paramsObj);
            const res = await fetch(
                `https://api.utdnebula.com/course?course_number=${paramsObj.courseNumber}&subject_prefix=${paramsObj.subjectPrefix}`,
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
export function getNebulaCourse(paramsObj: fetchCourse_params) {
    const profPromise = new Promise<courseData> ((resolve, reject) => {
        fetchHelper(paramsObj).then((fetched: any) => {
            if (fetched?.data) {
                let newData: courseData = fetched.data;
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
// console.log(await getNebulaCourse({courseNumber: "4337", subjectPrefix: "CS"}));