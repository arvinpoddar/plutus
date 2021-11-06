// import { numToDollar, formatDate } from 'src/components/mixins/format'
import dayjs from 'dayjs'

export const mainChartOptions = {
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
  markers: {
    size: 0,
    colors: ['#785FFF'],
    strokeColors: '#785FFF',
    strokeWidth: 3,
    strokeOpacity: 1,
    fillOpacity: 1,
    shape: 'circle',
    radius: 2,
    hover: {
      size: 7
    }
  },
  xaxis: {
    type: 'datetime',
    tickPlacement: 'on',
    tooltip: {
      enabled: false
    },
    axisBorder: {
      show: false
    },
    labels: {
      offsetY: 2,
      style: {
        fontSize: '13px',
        cssClass: 'ts-axis-labels'
      },
      datetimeFormatter: {
        year: 'MMM y',
        month: 'MMM y',
        day: 'MMM d',
        hour: 'h:mm tt'
      }
    },
    axisTicks: {
      show: true,
      borderType: 'solid',
      color: '#F6F5F9'
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
  grid: {
    show: false
  },
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const xVals = w.globals.seriesX[0]
      const yVals = series[seriesIndex]
      const time = xVals[dataPointIndex]
      const amount = yVals[dataPointIndex]
      return tooltipFactory(time, amount)
    }
  }
}

export const rangeOptions = [
  {
    label: '1 Month',
    value: 'month'
  },
  {
    label: '1 Year',
    value: 'year'
  },
  {
    label: 'All',
    value: 'all'
  }
]

function numToDollar (amount, toInteger = false) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: toInteger ? 0 : 2
  })

  return formatter.format(amount)
}

function tooltipFactory (time, amount) {
  const date = dayjs(time).add(1, 'days').format('MMM d')
  return `<div class="ts-tooltip">
        <div class="ts-tooltip-title">${numToDollar(amount)}</div>
        <div class="ts-tooltip-subtitle">${date}</div>
    </div>`
}
