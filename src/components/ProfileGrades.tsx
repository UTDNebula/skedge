import Chart from "react-apexcharts"
import { useState } from "react"

export interface GradeDistribution {
  name: string;
  series: ApexAxisChartSeries;
}

import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai"

const gradeChartOptions = {
  plotOptions: {
    bar: {
      distributed: true
    }
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
      left: 20,
      right: 20
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

export const ProfileGrades = (props) => {
  const [page, setPage] = useState(0);

  const { gradeDistributionData }:{ gradeDistributionData: GradeDistribution[] } = props;

  const prevPage = () => {
    if (page == 0) {
      setPage(gradeDistributionData.length - 1)
    } else {
      setPage(page - 1)
    }
  }

  const nextPage = () => {
    if (page == gradeDistributionData.length - 1) {
      setPage(0)
    } else {
      setPage(page + 1)
    }
  }

  return (
    <>
      <header className="bg-blue-dark rounded-t-2xl flex">
        <button onClick={prevPage} className="flex-auto text-center hover:bg-blue-dark-hover rounded-tl-2xl transition duration-250 ease-in-out flex items-center justify-center"><AiFillCaretLeft size={20} color="white" /></button>
        <h2 className="flex-auto text-center text-white mx-auto py-2">{gradeDistributionData[page].name}</h2>
        <button onClick={nextPage} className="flex-auto text-center hover:bg-blue-dark-hover rounded-tr-2xl transition duration-250 ease-in-out flex items-center justify-center"><AiFillCaretRight size={20} color="white" /></button>
      </header>
      <div className="border-blue-dark border-r-2 border-l-2 border-b-2 rounded-b-2xl">
        <Chart options={gradeChartOptions} series={gradeDistributionData[page].series} type="bar" height={150}></Chart>
      </div>
    </>
  )
}