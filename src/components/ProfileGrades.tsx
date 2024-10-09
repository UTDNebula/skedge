import React from 'react';
import Chart from 'react-apexcharts';

import { gradeChartOptions } from '~utils/styling';

export interface GradeDistribution {
  name: string;
  series: ApexAxisChartSeries;
}

export const ProfileGrades = ({
  series,
  total,
}: {
  series: GradeDistribution;
  total: number;
}) => {
  return (
    <>
      <header className="bg-cornflower-600 rounded-t-2xl flex">
        <h2 className="flex-auto text-center text-white mx-auto py-2">
          {'Grades Distribution (' + total + ')'}
        </h2>
      </header>
      <div className="border-cornflower-600 border-r-2 border-l-2 border-b-2 rounded-b-2xl pr-2">
        <Chart
          options={gradeChartOptions}
          series={series}
          type="bar"
          height={'100%'}
        ></Chart>
      </div>
    </>
  );
};
