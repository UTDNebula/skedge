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
import { ErrorLanding } from "~components/ErrorLanding";

// Example of how to fetch the scraped data from the background script, given that it exists
async function getCourseData () {
  
    return new Promise<ShowCourseTabPayload>((resolve, reject) => {
      sendToBackground({
        name: "getScrapeData",
      }).then((response) => {
        if (response) {
          resolve(response);
        } else {
          // console.error("Response from the background with courseData was null; Displaying course page.")
          throw("Attempted to get course data but failed. Please refresh or try again later.");
        }
      }).catch((err) => {
        reject(err);
      });
    });
}

export const CoursePage = () => { // TODO: CHANGE INTERFACE
  const { state } : { state: ProfessorProfileInterface[] } = useLocation();
  const [ loading, setLoading ] = useState(true)
  const [ profiles, setProfiles ] = useState(null)
  const [ error, setError ] = useState(null);
  const [ errorSrc, setErrorSrc ] = useState(null);

  useEffect(() => {
    if (!state) {
      setLoading(true)
      getCourseData().then(payload => {
        buildProfessorProfiles(payload).then(profiles => {
          setProfiles(profiles)
        }).catch(
          (err) => {
            console.log("Error building profiles", err)
            setLoading(false);
            setError(err);
            setErrorSrc('Issue building Professor Profiles');
          }
        ).finally(() => setLoading(false))
      }).catch(
        (err) => {
          // Display welcome page
          setLoading(false);
          
          // If we want to display error page instead, uncomment below
          // setError(err);
          // setErrorSrc('Issue getting Course Data');
        }
      )
    } else {
      setProfiles(state)
      setLoading(false)
    }
  }, [])

  return(
    <div className="w-[450px] p-4">
      { error && <ErrorLanding errSrc={errorSrc} error={error}></ErrorLanding>}
      { !loading && !error && profiles &&
        profiles.map((item, index) => <div className="mb-4"><MiniProfessor key={index} profiles={profiles} professorData={item} /></div>)
      }
      { loading && !error && <Loading /> }
      { !loading && !error && !profiles && <Landing />}
    </div>
  )
}