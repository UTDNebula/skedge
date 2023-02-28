interface fetchParams {
    firstName: string,
    lastName: string
};

interface output {
    professorData: string, // Json
};


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

export function fetchNebulaProfessor(paramsObj: fetchParams) {
    const headers = {
        "x-api-key": unRegister(NEBULA_API_KEY),
        Accept: "application/json",
    };
    const getDataPromise = new Promise((resolve, reject) => {
        try {
            fetch(
                `https://api.utdnebula.com/professor?first_name=${paramsObj.firstName}&last_name=${paramsObj.lastName}`,
                {
                    method: "GET",
                    headers: headers,
                }
            )
                .then(function (res) {
                    resolve(res.json());
                })
                .catch(function (err) {
                    console.log(err);
                    reject(null);
                });
        } catch (err) {
            console.log("Error getting data: " + err);
            reject(null);
        }
    });

    return getDataPromise;
}