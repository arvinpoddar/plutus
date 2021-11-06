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
    colors: ['#785FFF'],
    width: 4
  },
  fill: {
    colors: ['#0058E3', '#0058E3'],
    type: 'gradient',
    gradient: {
      type: 'vertical',
      gradientToColors: ['#0058E3', '#0058E3'],
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 90, 100]
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
