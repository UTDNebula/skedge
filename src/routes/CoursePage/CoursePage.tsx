import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import { sendToBackground } from "@plasmohq/messaging"

import ErrorPage, { CustomError } from "~components/ErrorPage"
import { Landing } from "~components/Landing"
import { Loading } from "~components/Loading"
import { MiniProfessor } from "~components/MiniProfessor"
import {
  ProfessorProfileInterface,
  buildProfessorProfiles
} from "~data/builder"

export function CoursePage() {
  // TODO: CHANGE INTERFACE
  const { state }: { state: ProfessorProfileInterface[] } = useLocation()
  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState<ProfessorProfileInterface[]>()
  const [error, setError] = useState<CustomError>()
  useEffect(() => {
    if (!state) {
      setLoading(true)
      sendToBackground({
        name: "getScrapeData"
      })
        .then((payload) => {
          if (!payload || payload.length < 1) {
            // null data or empty array
            throw "Attempted to GET course data but failed. Please refresh or try again later."
          }
          buildProfessorProfiles(payload)
            .then((profiles) => {
              setProfiles(profiles)
            })
            .catch((err) => {
              setLoading(false)
              setError({
                details: err,
                source: "Build Professor Profiles"
              })
            })
            .finally(() => setLoading(false))
        })
        .catch((err) => {
          // Display welcome page
          setLoading(false)
          setError({
            details: err,
            source: "GET Course Data"
          })
        })
    } else {
      setProfiles(state)
      setLoading(false)
    }
  }, [])

  return (
    <div className="w-[450px] p-4">
      {error && <ErrorPage error={error}></ErrorPage>}
      {!loading &&
        !error &&
        profiles &&
        profiles.map((item, index) => (
          <div className="mb-4">
            <MiniProfessor
              key={index}
              profiles={profiles}
              professorData={item}
            />
          </div>
        ))}
      {loading && !error && <Loading />}
      {!loading && !error && !profiles && <Landing />}
    </div>
  )
}
