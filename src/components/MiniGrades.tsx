import React from 'react';
import Chart from 'react-apexcharts';

import { miniGradeChartOptions } from '~utils/styling';

export const MiniGrades = ({ series }: { series: ApexAxisChartSeries }) => {
  return (
    <Chart
      options={miniGradeChartOptions}
      series={series}
      type="bar"
      height={'100%'}
    ></Chart>
  );
};
