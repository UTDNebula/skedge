import { Skeleton } from '@mui/material';
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
    <div className="flex flex-col items-center gap-2">
      <p className="text-2xl font-bold text-center">
        {isCourse ? searchQueryLabel(header) : header}
      </p>
      {isCourse && (
        <>
          {(grades.state === 'loading' && (
            <Skeleton variant="rounded">
              <p className="text-lg font-semibold">Overall grade: A+</p>
            </Skeleton>
          )) ||
            (grades.state === 'done' && (
              <p className="text-lg font-semibold">
                {'Overall grade: ' + grades.data.letter_grade}
              </p>
            ))}
          <a
            href={
              TRENDS_URL +
              'dashboard?searchTerms=' +
              encodeURIComponent(searchQueryLabel(header))
            }
            target="_blank"
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
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
