import type { ApexOptions } from "apexcharts";

/** sets the background color of an element based on the score */
export const getScoreColor = (value: number, outOf: number, inverted: boolean) => {
  value = (inverted ? outOf - value : value) / outOf;
  const hue = (value * 120).toString(10);
  return ["hsl(", hue, ",100%,85%)"].join("");
}

/** Apex styling options for the profile grade distribution chart */
export const gradeChartOptions: ApexOptions = {
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

/** Apex styling options for the profile grade distribution chart */
export const ratingsChartOptions: ApexOptions = {
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
    '#5ae630',
    '#91e630',
    '#e6d230',
    '#ffa357',
    '#ff5757',
  ],
  labels: ['5', '4', '3', '2', '1']
}

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