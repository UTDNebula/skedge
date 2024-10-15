import { Skeleton } from '@mui/material';
import React from 'react';

import BarGraph from '~components/BarGraph';
import type { GenericFetchedData, GradesType } from '~pages/CoursePage';
import type SearchQuery from '~utils/SearchQuery';
import {
  convertToCourseOnly,
  convertToProfOnly,
  searchQueryLabel,
} from '~utils/SearchQuery';
import { TRENDS_URL } from '~data/config';

function convertNumbersToPercents(distribution: GradesType): number[] {
  const total = distribution.total;
  return distribution.grade_distribution.map(
    (frequencyOfLetterGrade) => (frequencyOfLetterGrade / total) * 100,
  );
}

type Props = {
  title?: string;
  course: SearchQuery;
  grades: GenericFetchedData<GradesType>;
};

function SingleGradesInfo({ title, course, grades }: Props) {
  if (typeof grades === 'undefined' || grades.state === 'error') {
    return null;
  }
  if (grades.state === 'loading') {
    return (
      <div className="p-2">
        <Skeleton variant="rounded" className="w-full h-60 m-2" />
        <div className="flex flex-wrap justify-around">
          <p>
            Grades: <Skeleton className="inline-block w-[5ch]" />
          </p>
          <p>
            GPA: <Skeleton className="inline-block w-[5ch]" />
          </p>
        </div>
      </div>
    );
  }

  const percents = convertNumbersToPercents(grades.data);

  let trendsLink = TRENDS_URL + 'dashboard?searchTerms=';
  const courseOnly = convertToCourseOnly(course);
  const profOnly = convertToProfOnly(course);
  const courseValid = Object.keys(courseOnly).length !== 0;
  const profValid = Object.keys(profOnly).length !== 0;
  if (courseValid) {
    trendsLink += encodeURIComponent(searchQueryLabel(courseOnly));
  }
  if (courseValid && profValid) {
    trendsLink += encodeURIComponent(',');
  }
  if (profValid) {
    trendsLink += encodeURIComponent(searchQueryLabel(profOnly));
  }

  return (
    <div className="p-2">
      <div className="h-64">
        <BarGraph
          title={title ?? '# of Students'}
          xaxisLabels={[
            'A+',
            'A',
            'A-',
            'B+',
            'B',
            'B-',
            'C+',
            'C',
            'C-',
            'D+',
            'D',
            'D-',
            'F',
            'W',
          ]}
          yaxisFormatter={(value) => Number(value).toFixed(0).toLocaleString()}
          tooltipFormatter={(value, { dataPointIndex }) =>
            Number(value).toFixed(0).toLocaleString() +
            ' (' +
            percents[dataPointIndex].toFixed(2) +
            '%)'
          }
          series={[
            {
              name: searchQueryLabel(course),
              data: grades.data.grade_distribution,
            },
          ]}
        />
      </div>
      <div className="flex flex-wrap justify-around">
        <p>
          Grades: <b>{grades.data.total.toLocaleString()}</b>
        </p>
        <p>
          GPA:{' '}
          <b>{grades.data.gpa === -1 ? 'None' : grades.data.gpa.toFixed(3)}</b>
        </p>
      </div>
      <div className="flex justify-center">
        <a
          href={trendsLink}
          target="_blank"
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          rel="noreferrer"
        >
          See on Trends
        </a>
      </div>
    </div>
  );
}

export default SingleGradesInfo;
