<template>
  <div class="full-height col">
    <apexchart
      ref="chart"
      type="line"
      height="100%"
      width="100%"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { flatChartOptions } from 'src/components/chart/flatChartConfig'
import VueApexCharts from 'vue3-apexcharts'

import dayjs from 'dayjs'

const FORMAT = 'YYYY-MM-DD'

export default defineComponent({
  name: 'FlatChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    expenses: Array
  },
  data: function () {
    return {
      chartOptions: flatChartOptions
    }
  },
  computed: {
    dataArray () {
      const dateToExpenseMap = {}

      const NUM_DAYS = 30
      const startDate = dayjs().subtract(30, 'days')

      for (let i = 0; i <= NUM_DAYS; i++) {
        const date = startDate.add(i, 'days').format(FORMAT)
        dateToExpenseMap[date] = 0
      }

      this.expenses.forEach((expense) => {
        const expenseDate = dayjs(expense.date).format(FORMAT)
        if (expenseDate in dateToExpenseMap) {
          dateToExpenseMap[expenseDate] += expense.price
        }
      })

      const entries = Object.entries(dateToExpenseMap)

      entries.map((entry) => [new Date(entry[0]).getTime(), entry[1]])

      return entries
    },
    series () {
      return [
        {
          name: '',
          data: this.dataArray
        }
      ]
    }
  },
  methods: {}
})
</script>

<style lang="scss">
.ts-axis-labels {
  fill: #92929d;
}

.ts-tooltip {
  background: #ffffff;
  padding: 10px 20px;
  text-align: center;
  border: 0px;
  border-radius: 10px;
  .ts-tooltip-title {
    font-size: 16px;
    font-weight: 600;
  }
  .ts-tooltip-subtitle {
    font-size: 14px;
    font-weight: 400;
    color: var(--dark-grey);
  }
}
</style>
