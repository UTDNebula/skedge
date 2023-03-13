import Chart from "react-apexcharts"
import { miniGradeChartOptions } from "~utils/styling";
import type { GradeDistribution } from "./ProfileGrades"

export const MiniGrades = ({ gradeDistributionData } : { gradeDistributionData: GradeDistribution }) => {
  miniGradeChartOptions.title.text = gradeDistributionData.name;
  return (
    <>
      <Chart options={miniGradeChartOptions} series={gradeDistributionData.series} type="bar" height={124}></Chart>
    </>
  )
}