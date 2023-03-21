import { sendToBackground } from "@plasmohq/messaging";
import { useEffect, useState } from "react";
import { Rings } from "react-loader-spinner";
import { useLocation } from "react-router-dom";
import type { ShowCourseTabPayload } from "~background";
import { Loading } from "~components/Loading";
import { MiniProfessor } from "~components/MiniProfessor"
import type { GradeDistribution } from "~components/ProfileGrades";
import { buildProfessorProfiles } from "~data/builder";

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
      { !loading && 
        profiles.map((item, index) => <div className="mb-4"><MiniProfessor key={index} profiles={profiles} professorData={item} /></div>)
      }
      { loading && <Loading /> }  
    </div>
  )
}