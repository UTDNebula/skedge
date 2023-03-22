import { useState } from "react";
import Chart from "react-apexcharts"
import { miniGradeChartOptions } from "~utils/styling";
import type { GradeDistribution } from "./ProfileGrades"

export const MiniGrades = ({ gradeDistributionData } : { gradeDistributionData: GradeDistribution }) => {
  const config = JSON.parse(JSON.stringify(miniGradeChartOptions))
  config.title.text = gradeDistributionData.name;
  return (
    <>
      <Chart options={config} series={gradeDistributionData.series} type="bar" height={124}></Chart>
    </>
  )
}