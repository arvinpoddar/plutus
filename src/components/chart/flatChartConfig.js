export const flatChartOptions = {
  chart: {
    animations: {
      enabled: false
    },
    redrawOnWindowResize: true,
    fontFamily: 'Poppins, Helvetica, Arial, sans-serif',
    type: 'area',
    zoom: {
      enabled: false,
      autoScaleYaxis: true
    },
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'round',
    colors: ['#0058E3'],
    width: 4
  },
  fill: {
    colors: ['#0058E3', '#0058E3'],
    type: 'gradient',
    gradient: {
      type: 'horizontal',
      gradientToColors: ['#0058E3', '#0058E3'],
      shadeIntensity: 1,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 100]
    }
  },
  xaxis: {
    show: false,
    type: 'datetime',
    tickPlacement: 'off',
    tooltip: {
      enabled: false
    },
    axisBorder: {
      show: false
    },
    labels: {
      show: false
    }
  },
  yaxis: {
    show: false,
    tickPlacement: 'off',
    axisBorder: {
      show: false
    },
    labels: {
      show: false
    }
  },
  tooltip: {
    enabled: false
  },
  grid: {
    show: false
  }
}
