import { Route, Routes } from "react-router-dom"

import { About } from "./about"
import { ProfessorProfile } from "./ProfessorProfile"

export const Routing = () => (
  <Routes>
    <Route path="/" element={<About />} />
    <Route path="/about" element={<ProfessorProfile />} />
  </Routes>
)