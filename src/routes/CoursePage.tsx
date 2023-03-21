import { sendToBackground } from "@plasmohq/messaging";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { ShowCourseTabPayload } from "~background";
import { MiniProfessor } from "~components/MiniProfessor"
import type { GradeDistribution } from "~components/ProfileGrades";
import { buildProfessorProfiles } from "~data/builder";
import { fetchNebulaProfessor } from "~data/fetch";
import { requestProfessorsFromRmp } from "~data/fetchFromRmp";

export interface ProfessorProfileInterface {
  name: string;
  profilePicUrl: string;
  rmpScore: number;
  diffScore: number;
  wtaScore: number;
  rmpTags: string[];
  gradeDistributions: GradeDistribution[];
  ratingsDistribution: number[]; // temp
}

/** Temporary for testing */
export const mockData: ProfessorProfileInterface = {
  name: "Johny Deere",
  profilePicUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSUe2eaB9QYVkoJORkwnG2yfpPRqpqvRyUkWXOfvLOirm1mudvx",
  rmpScore: 4.3,
  diffScore: 2.55,
  wtaScore: 100,
  rmpTags: ["GREAT LECTURES", "SKIP CLASS? YOU WON'T PASS", "FRIENDLY", "TOUGH GRADER", "LOTS OF HOMEWORK"],
  gradeDistributions: [
    {
      name: "MATH 2418.003 (18S)",
      series: [{
        name: 'Students',
        data: [30, 40, 35, 50, 49, 60, 70, 79, 80, 10, 24, 65, 12, 50]
      }]
    },
    {
      name: "MATH 2418.003 (17S)",
      series: [{
        name: 'Students',
        data: [10, 40, 35, 50, 29, 65, 70, 79, 30, 15, 24, 35, 12, 20]
      }]
    }
  ],
  ratingsDistribution: [20, 13, 20, 33, 7]
}

// Example of how to fetch the scraped data from the background script, given that it exists
async function getCourseData () {
  const response: ShowCourseTabPayload = await sendToBackground({
    name: "getScrapeData",
  })
  return response;
}

export const CoursePage = () => { // TODO: CHANGE INTERFACE
  const { state } : { state: ProfessorProfileInterface[] } = useLocation();
  const [ loading, setLoading ] = useState(true)
  const [ profiles, setProfiles ] = useState(null)

  useEffect(() => {
    if (!state) {
      setLoading(true)
      getCourseData().then(payload => {
        buildProfessorProfiles(payload).then(profiles => {
          console.log(profiles)
          setProfiles(profiles)
        }).finally(() => setLoading(false))
      })
    } else {
      setProfiles(state)
      setLoading(false)
    }
  }, [])

  return(
    <div className="w-[450px] p-4">
      {!loading && 
        profiles.map((item, index) => <div className="mb-4"><MiniProfessor key={index} profiles={profiles} professorData={item} /></div>)
      }
    </div>
  )
}