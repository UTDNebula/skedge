import React from 'react';
import Chart from 'react-apexcharts';

import { ratingsChartOptions } from '~utils/styling';

export const RmpRatings = ({
  series,
  total,
}: {
  series: number[];
  total: number;
}) => {
  return (
    <div className="my-2">
      <header className="bg-blue-dark rounded-t-2xl flex">
        <h2 className="flex-auto text-center text-white mx-auto py-2">
          {'Ratings Distribution (' + total + ')'}
        </h2>
      </header>
      <div className="border-blue-dark border-r-2 border-l-2 border-b-2 rounded-b-2xl">
        <Chart
          options={ratingsChartOptions}
          series={series}
          type="donut"
          height={300}
        ></Chart>
      </div>
    </div>
  );
};
