import React from 'react';

import SingleGradesInfo from '~components/SingleGradesInfo';
import { searchQueryLabel } from '~utils/SearchQuery';

const gpaToLetterGrade = (gpa: number): string => {
  if (gpa >= 4.0) return 'A';
  if (gpa >= 3.67) return 'A-';
  if (gpa >= 3.33) return 'B+';
  if (gpa >= 3.0) return 'B';
  if (gpa >= 2.67) return 'B-';
  if (gpa >= 2.33) return 'C+';
  if (gpa >= 2.0) return 'C';
  if (gpa >= 1.67) return 'C-';
  if (gpa >= 1.33) return 'D+';
  if (gpa >= 1.0) return 'D';
  if (gpa >= 0.67) return 'D-';
  return 'F';
};

const CourseOverview = ({ course, grades }: CourseOverviewProps) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xl font-bold text-center">
        {searchQueryLabel(course)}
      </p>
      {grades.state === 'done' && (
        <p className="text-lg font-semibold text-center">
          {'Overall grade: ' + gpaToLetterGrade(grades.data.gpa)}
        </p>
      )}
      <a
        href={'https://trends.utdnebula.com/dashboard?searchTerms=' + encodeURIComponent(searchQueryLabel(course))}
        target="_blank"
        className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600 text-center"
        rel="noreferrer"
      >
        See on Trends
      </a>
    </div>
  );
};

export default CourseOverview;
