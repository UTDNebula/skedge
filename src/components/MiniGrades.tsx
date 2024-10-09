import React from 'react';
import Chart from 'react-apexcharts';
import { Rings } from 'react-loader-spinner';

import { miniGradeChartOptions } from '~utils/styling';

export const MiniGrades = ({
  series,
  loading,
}: {
  series: ApexAxisChartSeries;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <Rings
        height="100%"
        width="100%"
        color="#1C2A6D"
        radius="6"
        wrapperClass="block mx-auto w-full h-full"
        visible={true}
        ariaLabel="rings-loading"
      />
    );
  }
  return (
    <Chart
      options={miniGradeChartOptions}
      series={series}
      type="bar"
      height={'100%'}
    ></Chart>
  );
};
