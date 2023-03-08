
type FetchSection_params = {
  courseReference: string;
  professorReference: string;
};

type Section = {
  term: string;
  title: string;
  course_number: string;
  school: string;
  location: string;
  activity_type: string;
  class_number: string;
  days: string;
  assistants: string;
  times: string;
  topic: string;
  core_area: string;
  department: string;
  section_name: string;
  course_prefix: string;
  instructors: string;
  section_number: string;
};

type SectionList = {
  sections: Section[];
};

//Hash to get API key
function unRegister(myVar: string) {
  let newVar = "";
  for(var i = 0; i < myVar.length; i++) {
    let a = myVar.charCodeAt(i);
    a = ((a*2)-8)/2;
    newVar = newVar.concat(String.fromCharCode(a));
  }
  return newVar;
}

//Nebula key
let NEBULA_API_KEY = "EM~eW}G<}4qx41fp{H=I]OZ5MF6T:1x{<GF:~v<";

const fetchOptions = {
    method: "GET",
    headers: {
        "x-api-key": unRegister(NEBULA_API_KEY),
        Accept: "application/json",
    },
}

async function fetchNebulaSections(paramsObj: FetchSection_params): Promise<SectionList> {
  try {
    const res = await fetch(`https://api.utdnebula.com/section?course_reference=${paramsObj.courseReference}&professors=${paramsObj.professorReference}`, fetchOptions);
    const json = await res.json();
    if(json.data == null) {
      throw new Error("Null data");
    }
    const data: SectionList = json.data;
    return data;
  } catch(error) {
    return null;
  }
}

console.log((await fetchNebulaSections({courseReference: "3377", professorReference: "Peterson"})));
