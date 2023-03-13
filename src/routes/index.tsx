import { Route, Routes } from "react-router-dom"

import { About } from "./about"
import { CoursePage } from "./CoursePage"
import { Home } from "./home"
import { ProfessorProfile } from "./ProfessorProfile"

export const Routing = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/test" element={<CoursePage />} />
    <Route path="/about" element={<ProfessorProfile />} />
  </Routes>
)