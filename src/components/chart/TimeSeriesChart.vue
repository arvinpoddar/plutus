<template>
  <div class="full-height col">
    <div class="row items-center">
      <div class="chart-title col">{{ title }}</div>
      <q-btn
        v-for="range in rangeOptions"
        :key="range.value"
        :label="range.label"
        class="q-px-md range-btn"
        :class="{
          'text-grey-6': range.value !== currentRange,
          'f-bold text-primary': range.value === currentRange,
        }"
        @click="setRange(range.value)"
        no-caps
        flat
        dense
        :ripple="false"
      />
    </div>
    <div class="ellipsis portfolio-amount">
      {{ numToDollar(balance) }}
    </div>
    <apexchart
      ref="chart"
      type="line"
      height="81%"
      width="100%"
      :options="chartOptions"
      :series="series"
    />
    <!-- LOADING OVERLAY -->
    <q-inner-loading :showing="loading">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>

    <!-- FAILURE OVERLAY -->
    <q-inner-loading :showing="failed && !loading">
      <q-icon name="warning" color="negative" size="75px" />
      Could not fetch chart data
    </q-inner-loading>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import mixin from 'src/mixins/mixin'

import {
  timeSeriesChartOptions,
  rangeOptions
} from 'src/components/dashboard/chartConfig'

import dayjs from 'dayjs'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  name: 'TimeSeriesChart',
  components: {
    apexchart: VueApexCharts
  },
  mixins: [mixin],
  props: {
    title: {
      type: String
    },
    type: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  data: function () {
    return {
      rangeOptions,
      chartOptions: timeSeriesChartOptions,

      loading: false,
      failed: false,

      currentRange: 'month',
      events: [],
      fetchDataMethod: null
    }
  },
  computed: {
    dataArray () {
      return this.events.map((event) => [
        new Date(event.created_at).getTime(),
        event.balance
      ])
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
  methods: {
    setRange (range = 'year') {
      this.currentRange = range
      this.fetchChartData()
    },

    setXAxis (data) {
      this.$refs.chart.updateOptions({
        xaxis: {
          categories: data
        }
      })
    },

    setYAxis (data) {
      this.$refs.chart.updateSeries([
        {
          name: '',
          data: data
        }
      ])
    },

    async fetchChartData () {
      let startDate, endDate
      if (this.currentRange === 'month') {
        endDate = dayjs()
        startDate = endDate.subtract(1, 'month')
      } else if (this.currentRange === 'year') {
        endDate = dayjs()
        startDate = endDate.subtract(1, 'year')
      }

      try {
        this.loading = true
        this.events = await this.fetchDataMethod(this.id, startDate, endDate)
        if (startDate && endDate) {
          this.$refs.chart.zoomX(startDate.valueOf(), endDate.valueOf())
        }
        this.$refs.chart.resetSeries(true, true)
      } catch (err) {
        this.failed = true
      } finally {
        this.loading = false
      }
    },

    initializeChart () {
      if (this.type === 'account') {
        this.fetchDataMethod =
          this.$InfiniteGiving.AccountBalanceEvent.listForAccount
      } else if (this.type === 'organization') {
        this.fetchDataMethod =
          this.$InfiniteGiving.OrganizationBalanceEvent.listForOrganization
      }
      this.fetchChartData()
    }
  },

  mounted () {
    this.initializeChart()
  }
})
</script>

<style lang="scss">
.chart-title {
  font-size: 16px;
  color: var(--dark-grey);
  font-weight: 500;
}

.portfolio-amount {
  font-size: 36px;
  font-weight: 600;
  color: #000;
  margin-bottom: 10px;
}

.range-btn {
  font-size: 14px;
  padding: 0px 12px;
}

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

.apexcharts-tooltip {
  box-shadow: 0px 0px 10px rgba(68, 68, 79, 0.2) !important;
  border: 0px !important;
  border-radius: 10px;
}

line.apexcharts-xcrosshairs {
  stroke: var(--q-primary);
  stroke-dasharray: 0;
}
</style>
