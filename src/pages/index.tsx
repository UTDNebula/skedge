import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { CoursePage } from './CoursePage';
import { ProfessorProfile } from './ProfessorProfile';

export const Routing = () => (
  <Routes>
    <Route path="/" element={<CoursePage />} />
    <Route path="/professor" element={<ProfessorProfile />} />
  </Routes>
);
