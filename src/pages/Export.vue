<template>
  <q-page class="category-layout fixed-layout">
    <q-form @submit="exportData">
      <div
        class="q-px-lg q-py-lg flex column full-width"
        style="min-height: 100vh"
      >
        <div class="row q-mb-md">
          <q-btn
            icon="pl:icon-chevron-left"
            color="grey"
            size="lg"
            flat
            dense
            style="margin-left: -20px"
            @click="goBack"
          />
          <div class="col ellipsis header">Export</div>
        </div>

        <Loader v-if="loading" />

        <div class="q-gutter-y-md" v-else>
          <!-- SELECT DATES -->
          <div class="pl-stack-input">
            <div class="sl-label">Dates</div>
            <select v-model="range" class="pl-n-select sl-input" required>
              <option
                v-for="range in rangeOptions"
                :key="range.value"
                :value="range.value"
              >
                {{ range.label }}
              </option>
            </select>
          </div>

          <q-date
            v-if="range === 'custom'"
            range
            v-model="customRange"
            class="full-width q-mb-md pl-date-picker"
            minimal
            flat
          />

          <!-- SELECT CATEGORIES -->
          <div class="pl-stack-input">
            <div class="sl-label">Categories</div>
            <q-select
              outlined
              v-model="categories"
              multiple
              :options="categoryOptions"
              use-chips
              stack-label
              class="pl-select sl-input"
              required
              behavior="menu"
            >
              <template v-slot:selected-item="scope">
                <q-chip
                  removable
                  dense
                  @remove="scope.removeAtIndex(scope.index)"
                  :tabindex="scope.tabindex"
                  color="primary"
                  text-color="white"
                  class="q-ma-xs f-med"
                  style="font-size: 12px"
                >
                  {{ scope.opt.name }}
                </q-chip>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- SELECT PAYMENT METHODS -->
          <div class="pl-stack-input">
            <div class="sl-label">Payment methods</div>
            <q-select
              outlined
              v-model="methods"
              multiple
              :options="methodOptions"
              use-chips
              stack-label
              class="pl-select sl-input"
              required
              behavior="menu"
            >
              <template v-slot:selected-item="scope">
                <q-chip
                  removable
                  dense
                  @remove="scope.removeAtIndex(scope.index)"
                  :tabindex="scope.tabindex"
                  color="primary"
                  text-color="white"
                  class="q-ma-xs f-med"
                  style="font-size: 12px"
                >
                  {{ scope.opt.name }}
                </q-chip>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="f-18 text-grey">
            {{ filteredExpenses.length }} matching expenses
          </div>
        </div>
      </div>

      <div class="fixed-controls">
        <q-btn
          class="pl-btn full-width q-mb-md"
          label="Export"
          color="primary"
          text-color="white"
          :loading="exporting"
          type="submit"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import dayjs from 'dayjs'
import notify from 'src/components/mixins/notify'

const rangeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Last 7 days', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'This year', value: 'year' },
  { label: 'Custom', value: 'custom' }
]

export default defineComponent({
  name: 'PageViewCategory',
  mixins: [notify],
  components: {},
  data () {
    return {
      range: 'all',
      expenses: [],
      categories: [],
      methods: [],

      categoryOptions: [],
      methodOptions: [],
      rangeOptions,

      // FOR CUSTOM RANGE ONLY
      customRange: {
        from: '',
        to: ''
      },

      loading: false,
      exporting: false
    }
  },
  computed: {
    dateRange () {
      const range = {
        min: null,
        max: dayjs()
      }
      if (this.range === 'all') {
        range.min = dayjs('1970-01-01')
      } else if (this.range === 'week') {
        range.min = dayjs().subtract(7, 'day')
      } else if (this.range === 'month') {
        range.min = dayjs().subtract(1, 'month')
      } else if (this.range === 'year') {
        range.min = dayjs().subtract(1, 'year')
      } else if (this.range === 'custom') {
        range.min = dayjs(this.customRange.from)
        range.max = dayjs(this.customRange.to)
      }
      return range
    },

    filteredExpenses () {
      const categorySelection = this.categories.map((cat) => cat.id)
      const methodSelection = this.methods.map((method) => method.id)

      return this.expenses.filter((expense) => {
        // CHECK CATEGORY IS IN SELECTION
        for (const category of expense.categories) {
          if (!categorySelection.includes(category)) {
            return false
          }
        }

        // CHECK PAYMENT METHOD IS IN SELECTION
        if (!methodSelection.includes(expense.payment_method)) {
          return false
        }

        // CHECK EXPENSE DATE IN RANGE
        const minDate = this.dateRange.min.toISOString()
        const maxDate = this.dateRange.max.toISOString()
        if (!(expense.date >= minDate && expense.date <= maxDate)) {
          return false
        }
        return true
      })
    }
  },
  methods: {
    async getOptions () {
      try {
        this.loading = true
        this.expenses = (await this.$api.get('/expenses')).data
        // Fetch all categories and automatically add the current one (if it is valid)
        this.categoryOptions = (await this.$api.get('/categories')).data
        this.categories = [...this.categoryOptions]

        // Fetch all payment methods
        this.methodOptions = (await this.$api.get('/payment-methods')).data
        this.methods = [...this.methodOptions]
      } catch (err) {
        this.showError('Could not fetch user data', err)
      } finally {
        this.loading = false
      }
    },

    goBack () {
      this.$router.go(-1)
    },

    async exportData () {
      try {
        this.exporting = true

        if (!this.filteredExpenses.length) {
          return this.showError('There are no expenses to export', null)
        }

        const csvContent = this.createCSVFromExpenses(this.filteredExpenses)

        // UPLOAD FILE, GET BACK URL
        const res = await this.$api.post('/exports', {
          file_content: csvContent
        })
        const url = res.data.url
        console.log('EXPORT URL:', url)

        // OPEN DOWNLOAD LINK IN SAFARI
        window.open = cordova.InAppBrowser.open
        window.open(url, '_system')
      } catch (err) {
        this.showError('Could not export your data', err)
      } finally {
        this.exporting = false
      }
    },

    createCSVFromExpenses (expenseArray) {
      const app = this
      let res = 'Date,Category,Name,Price,Payment Method,Description\n'

      const getCategoryNames = (expense) => {
        return expense.categories.map((cat) => {
          const match = app.categories.find((category) => category.id === cat)
          return match ? match.name : 'Unknown'
        })
      }

      const s = (str) => str.replaceAll(',', ';')

      for (const expense of expenseArray) {
        const date = dayjs(expense.date).format('MM/DD/YYYY')
        const category = getCategoryNames(expense).join(', ')
        const name = expense.name || 'No name'
        const price = String(expense.price)

        // Find payment method name
        const paymentMethod = this.methods.find(
          (m) => m.id === expense.payment_method
        )
        const paymentMethodString = paymentMethod
          ? paymentMethod.name
          : 'Unknown'

        const description = expense.description || 'No description'

        res += `${date},${s(category)},${s(name)},${s(price)},${s(
          paymentMethodString
        )},${s(description)}\n`
      }

      return res.trim()
    }
  },

  mounted () {
    this.getOptions()
  }
})
</script>

<style lang="scss">
.category-layout {
  .header {
    font-weight: bold;
    font-size: 24px;
    line-height: 54px;
  }
  .pl-date-picker {
    border: 2px solid #785fff;
    border-radius: 10px;
  }
}
</style>
