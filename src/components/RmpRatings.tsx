import Chart from "react-apexcharts"
import { ratingsChartOptions } from "~utils/styling";

export const RmpRatings = ({ ratingsDistributionData } : { ratingsDistributionData: number[] }) => {
  return (
    <>
      <header className="bg-blue-dark rounded-t-2xl flex">
        <h2 className="flex-auto text-center text-white mx-auto py-2">Ratings Distribution</h2>
      </header>
      <div className="border-blue-dark border-r-2 border-l-2 border-b-2 rounded-b-2xl">
        <Chart options={ratingsChartOptions} series={ratingsDistributionData} type="donut" height={300}></Chart>
      </div>
    </>
  )
}