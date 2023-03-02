import Chart from "react-apexcharts"

const ratingsChartOptions = {
  dataLabels: {
    enabled: false
  },
  chart: {
    toolbar: {
      show: false
    },
    id: 'ratings-distribution'
  },
  grid: {
    padding: {
      bottom: -95
    }
  },
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 90,
      offsetY: 10
    }
  },
  colors: [
    '#79ff57',
    '#c4ff57',
    '#ffee57',
    '#ffa357',
    '#ff5757',
  ],
  labels: ['5', '4', '3', '2', '1']
}

export const RmpRatings = (props) => {

  const { ratingsDistributionData }:{ ratingsDistributionData: number[] } = props;

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