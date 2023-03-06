import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts"
import type { GradeDistribution } from "./ProfileGrades"

export const miniGradeChartOptions: ApexOptions = {
  plotOptions: {
    bar: {
      distributed: true
    }
  },
  title: {
    text: "Undefined",
    align: 'center',
    margin: 0,
    offsetX: 0,
    offsetY: 0,
    floating: true,
    style: {
      fontSize:  '12px',
      fontWeight:  'semibold',
      fontFamily:  "Inter",
      color:  '#9B9B9B'
    },
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  colors: [
    '#79ff57',
    '#92ff57',
    '#abff57',
    '#c4ff57',
    '#ddff57',
    '#f7ff57',
    '#ffee57',
    '#ffd557',
    '#ffbc57',
    '#ffa357',
    '#ff8957',
    '#ff7057',
    '#ff5757',
    '#b8b8b8',
  ],
  chart: {
    toolbar: {
      show: false
    },
    id: 'grade-distribution'
  },
  grid: {
    padding: {
      left: 15,
      right: 5,
      bottom: -5
    },
    yaxis: {
      lines: {
        show: false
      }
    }
  },
  xaxis: {
    categories: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'W']
  },
  yaxis: {
    show: false
  }
}

export const MiniGrades = ({ gradeDistributionData }:{ gradeDistributionData: GradeDistribution }) => {
  miniGradeChartOptions.title.text = gradeDistributionData.name;
  return (
    <>
      <Chart options={miniGradeChartOptions} series={gradeDistributionData.series} type="bar" height={124}></Chart>
    </>
  )
}