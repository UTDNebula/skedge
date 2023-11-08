import { sendToBackground } from "@plasmohq/messaging";
import { useEffect, useState } from "react";
import { Rings } from "react-loader-spinner";
import { useLocation } from "react-router-dom";
import type { ShowCourseTabPayload } from "~background";
import { Title } from "~components/Title";
import { Landing } from "~components/Landing";
import { Landing2 } from "~components/Landing2";
import { Landing3 } from "~components/Landing3";
import { Landing4 } from "~components/Landing4";
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
    const { state }: { state: ProfessorProfileInterface[] } = useLocation();
  const [ landingSlide, setLandingSlide ] = useState(0)
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

  function updateSlide(n: number) : void 
  {
    setLandingSlide(n)
  }

  return( // h[784]
    <div className="w-[450px] h[784] p-4"> 
      { !loading && profiles &&
        profiles.map((item, index) => <div className="mb-4"><MiniProfessor key={index} profiles={profiles} professorData={item} /></div>)
          }

      { loading && <Loading /> }
      { !loading && !profiles && landingSlide==0 && <Title setLandingSlide={setLandingSlide} />}
      { !loading && !profiles && landingSlide==1 && <Landing setLandingSlide={setLandingSlide} />}
      { !loading && !profiles && landingSlide==2 && <Landing2 setLandingSlide={setLandingSlide} />}
      { !loading && !profiles && landingSlide==3 && <Landing3 setLandingSlide={setLandingSlide} />}
      { !loading && !profiles && landingSlide==4 && <Landing4 setLandingSlide={setLandingSlide} />}
      
    </div>
  )
}
