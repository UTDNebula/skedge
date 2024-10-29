import React from 'react';

import { TRENDS_URL } from '~data/config';
import type { GenericFetchedData, GradesType } from '~pages';
import { type SearchQuery, searchQueryLabel } from '~utils/SearchQuery';

type CourseOverviewProps = {
  course: SearchQuery;
  grades: GenericFetchedData<GradesType>;
};

const CourseOverview = ({ course, grades }: CourseOverviewProps) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xl font-bold text-center">
        {searchQueryLabel(course)}
      </p>
      {grades.state === 'done' && (
        <p className="text-lg font-semibold text-center">
          {'Overall grade: ' + grades.data.letter_grade}
        </p>
      )}
      <a
        href={
          TRENDS_URL +
          'dashboard?searchTerms=' +
          encodeURIComponent(searchQueryLabel(course))
        }
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
