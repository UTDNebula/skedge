import { Route, Routes } from "react-router-dom"

import { About } from "./about"
import { ProfessorProfile } from "./ProfessorProfile"

export const Routing = () => (
  <Routes>
    <Route path="/" element={<ProfessorProfile />} />
    <Route path="/about" element={<About />} />
  </Routes>
)