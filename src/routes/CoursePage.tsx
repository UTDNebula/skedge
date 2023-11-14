import { sendToBackground } from "@plasmohq/messaging";
import { useEffect, useState } from "react";
import { Rings } from "react-loader-spinner";
import { useLocation } from "react-router-dom";
import type { ShowCourseTabPayload } from "~background";
import { Landing } from "~components/Landing";
import { Loading } from "~components/Loading";
import { MiniProfessor } from "~components/MiniProfessor"
import type { GradeDistribution } from "~components/ProfileGrades";
import { buildProfessorProfiles, ProfessorProfileInterface } from "~data/builder";

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
      { !loading && profiles &&
        profiles.map((item, index) => <div className="mb-4" key={index}><MiniProfessor profiles={profiles} professorData={item} /></div>)
      }
      { loading && <Loading /> }
      { !loading && !profiles && <Landing />}
    </div>
  )
}