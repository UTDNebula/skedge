import { useMediaQuery } from '@mui/material';
import { type ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import React from 'react';

import { useRainbowColors } from '~utils/colors';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type GraphProps = {
  xaxisLabels?: string[];
  yaxisFormatter?: (val: number) => string;
  tooltipFormatter?: (
    val: number,
    extra: { series: number[]; seriesIndex: number; dataPointIndex: number },
  ) => string;
  series: {
    name: string;
    data: number[];
  }[];
  title: string;
  labels?: string[];
  includedColors?: boolean[];
};

/**
 * Creates a pre-configured ApexCharts vertical bar graph component. Takes in `series`, `title`, and `xaxisLabels` via `GraphProps`. This component also gets returned from a BarGraph component on a large screen.
 * @param props
 * @returns vertical bar graph
 */
function BarGraph(props: GraphProps) {
  let series = props.series;
  let noDataText = 'Please select a class to add';
  if (
    series.length !== 0 &&
    series.every((grade_distribution) =>
      grade_distribution.data.every((letter: number) => isNaN(letter)),
    )
  ) {
    series = [];
    noDataText = 'Grade data unavailable for selected courses';
  }

  const rainbowColors = useRainbowColors();

  const options: ApexOptions = {
    chart: {
      id: 'line-chart',
      zoom: {
        enabled: false,
      },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        distributed: series.length === 1,
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: series.length !== 1,
    },
    xaxis: {
      categories: props.xaxisLabels,
    },
    yaxis: {
      labels: {
        formatter: props.yaxisFormatter,
      },
    },
    colors: rainbowColors,
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    title: {
      text: props.title,
      align: 'left',
      style: {
        fontFamily: 'inherit',
      },
    },
    noData: {
      text: noDataText,
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: '14px',
        fontFamily: 'inherit',
      },
    },
    theme: {
      mode: useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light',
    },
    tooltip: {
      y: {
        formatter: props.tooltipFormatter ?? props.yaxisFormatter,
      },
    },
  };

  return (
    <div className="h-full">
      <Chart options={options} series={series} type="bar" height={'100%'} />
    </div>
  );
}

export default BarGraph;
