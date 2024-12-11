import React from 'react';

import { TRENDS_URL } from '~data/config';
import type { GenericFetchedData, GradesType } from '~pages';
import { type SearchQuery, searchQueryLabel } from '~utils/SearchQuery';

type CourseOverviewProps = {
  header: string | SearchQuery;
  grades: undefined | GenericFetchedData<GradesType>;
};

const CourseOverview = ({ header, grades }: CourseOverviewProps) => {
  const isCourse = typeof header !== 'string';
  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xl font-bold text-center">
        {isCourse ? searchQueryLabel(header) : header}
      </p>
      {isCourse && (
        <>
          {typeof grades !== 'undefined' && grades.state === 'done' && (
            <p className="text-lg font-semibold text-center">
              {'Overall grade: ' + grades.data.letter_grade}
            </p>
          )}
          <a
            href={
              TRENDS_URL +
              'dashboard?searchTerms=' +
              encodeURIComponent(searchQueryLabel(header))
            }
            target="_blank"
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600 text-center"
            rel="noreferrer"
          >
            See on Trends
          </a>
        </>
      )}
    </div>
  );
};

export default CourseOverview;
