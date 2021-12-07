<template>
  <Loader v-if="loading" />
  <q-page class="category-layout fixed-layout" v-else>
    <div
      class="q-px-lg q-py-lg flex column full-width"
      style="min-height: 100vh"
    >
      <div class="row q-mb-sm">
        <q-btn
          icon="pl:icon-chevron-left"
          color="grey"
          size="lg"
          flat
          dense
          style="margin-left: -20px"
          to="/"
        />
        <div class="col ellipsis header">{{ category.name }}</div>
        <!--<q-btn icon="pl:icon-list" color="black" flat dense />-->
      </div>

      <div class="pl-card main-card q-mb-lg">
        <div class="text-h6 f-bold">
          Total: {{ numToDollar(totalExpenses) }}
        </div>
        <div class="chart-container" style="height: 200px">
          <MainChart :expenses="searchResults" />
        </div>
      </div>

      <!-- SEARCH BAR -->
      <PLFieldInput v-model="search" placeholder="Search..." class="q-mb-sm">
        <template v-slot:append>
          <q-icon
            name="pl:icon-schedule"
            class="cursor-pointer"
            @click="showDateFilters = true"
          />
        </template>
      </PLFieldInput>

      <q-slide-item
        v-for="expense in searchResults"
        :key="expense.id"
        @right="deleteExpense(expense.id)"
        @click="viewExpense(expense.id)"
        right-color="negative"
        class="pl-card q-mb-md cursor-pointer"
        :ref="expense.id"
      >
        <template v-slot:right>
          <q-icon name="pl:icon-trash" />
        </template>
        <q-item class="row expense-card">
          <div class="col ellipsis">
            <div class="expense-name">{{ expense.name }}</div>
            <div class="expense-date">
              {{ formatDate(expense.date, "MM/DD/YYYY") }}
            </div>
          </div>
          <div class="expense-price">
            {{ formatAmount(expense.price, "dollar") }}
          </div>
        </q-item>
      </q-slide-item>

      <EmptyCard v-if="!searchResults.length" message="No expenses!" />
    </div>
    <div class="fixed-controls">
      <q-btn
        class="pl-btn full-width q-mb-md"
        label="Add Expense"
        color="primary"
        text-color="white"
        @click="addExpense"
      />
    </div>
  </q-page>

  <!-- DATE FILTER DIALOG -->
  <q-dialog v-model="showDateFilters" position="bottom">
    <q-card>
      <div class="q-px-sm q-pt-md">
        <q-option-group
          v-model="dateRangeChoice"
          :options="dateRangeOptions"
          color="primary"
        />
        <div v-if="dateRangeChoice === 'custom'" class="q-px-md q-mt-sm">
          <q-date
            range
            v-model="dateRange"
            class="full-width q-mb-md pl-date-picker"
            minimal
            flat
          />
        </div>
        <div class="row justify-end q-px-md">
          <q-btn
            class="pl-btn reset-button q-mb-md"
            label="Close"
            color="primary"
            v-close-popup
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import dayjs from 'dayjs'
import notify from 'src/components/mixins/notify'
import format from 'src/components/mixins/format'

import MainChart from 'src/components/chart/MainChart'

const dateRangeOptions = [
  {
    label: 'Show all',
    value: 'all'
  },
  {
    label: 'Last 7 days',
    value: 'week'
  },
  {
    label: 'This month',
    value: 'month'
  },
  {
    label: 'Custom',
    value: 'custom'
  }
]

export default defineComponent({
  name: 'PageViewCategory',
  mixins: [notify, format],
  components: {
    MainChart
  },
  data () {
    return {
      category: {
        name: '',
        expenses: []
      },

      search: '',

      showDateFilters: false,
      dateRangeOptions,
      dateRangeChoice: 'all',
      dateRange: {
        from: '',
        to: ''
      },

      loading: true
    }
  },
  computed: {
    filteredByDate () {
      // Filter initial expense list by dates (if date filters are present)

      let minDate = null
      let maxDate = null

      if (this.dateRangeChoice === 'all') {
        return [...this.category.expenses]
      } else if (this.dateRangeChoice === 'custom') {
        minDate = this.dateRange.from
          ? new Date(this.dateRange.from)
          : new Date('1970-01-01')
        maxDate = this.dateRange.to ? new Date(this.dateRange.to) : new Date()
      } else if (this.dateRangeChoice === 'week') {
        maxDate = dayjs().toDate()
        minDate = dayjs().subtract(7, 'day').toDate()
      } else if (this.dateRangeChoice === 'month') {
        maxDate = dayjs().toDate()
        minDate = dayjs().subtract(1, 'month').toDate()
      }

      const expensesWithinDates = this.category.expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= minDate && expenseDate <= maxDate
      })

      return expensesWithinDates
    },

    searchResults () {
      // Return original results if search is empty
      if (!this.search.trim()) {
        return [...this.filteredByDate]
      }

      // Split search queries into words
      const searchQueries = this.search.split(' ')

      // Filter the expense results
      const results = this.filteredByDate.filter((expense) => {
        // Combine all words from expense name and description into a list (lower case)
        let searchBody = `${expense.name} ${expense.description}`
        searchBody = searchBody.toLowerCase().split(' ')

        // Search all the words in the search body and see if any of them start
        // with the current query word.
        for (let query of searchQueries) {
          query = query.trim()
          for (let term of searchBody) {
            term = term.trim()
            if (query && term && term.startsWith(query.toLowerCase())) {
              return true
            }
          }
        }
        return false
      })
      return results
    },

    totalExpenses () {
      let sum = 0
      this.searchResults.forEach((expense) => {
        sum += expense.price
      })
      return sum
    }
  },
  methods: {
    async getCategory () {
      try {
        this.loading = true
        const id = this.$route.params.categoryId
        if (id) {
          const data = (await this.$api.get(`/categories/${id}`)).data
          this.category = Object.assign(this.category, data)
        } else {
          const expenses = (await this.$api.get('/expenses')).data
          this.category.expenses = expenses
          this.category.name = 'All Expenses'
        }
      } catch (err) {
        this.showError('Could not fetch this category', err)
      } finally {
        this.loading = false
      }
    },

    addExpense () {
      const id = this.$route.params.categoryId || ''
      this.$router.push(`/add-expense/${id}`)
    },

    viewExpense (id) {
      this.$router.push(`/expense/${id || ''}/`)
    },

    deleteExpense (id) {
      // Internal function for resetting the state of a slide item
      const reset = () => {
        if (this.$refs[id] && this.$refs[id].reset) {
          this.$refs[id].reset()
        }
      }

      this.$q
        .dialog({
          title: 'Delete',
          message: 'Are you sure you want to delete this expense?',
          cancel: true
        })
        .onOk(async () => {
          try {
            await this.$api.delete(`/expenses/${id}`)
            await this.getCategory()
          } catch (err) {
            this.showError('Could not delete expense', err)
          }
        })
        .onDismiss(() => reset())
    },

    resetDateFilters () {
      this.dateRange = {
        from: '',
        to: ''
      }
    }
  },

  mounted () {
    this.getCategory()
  }
})
</script>

<style lang="scss">
.category-layout {
  .main-card {
    padding: 16px 16px 4px 16px;
  }

  .header {
    font-weight: bold;
    font-size: 24px;
    line-height: 54px;
  }

  .expense-card {
    padding: 12px;
    cursor: pointer;
    font-weight: 500;

    .expense-name,
    .expense-price {
      font-size: 16px;
    }

    .expense-date {
      font-size: 12px;
      color: #bebebe;
    }
  }
}
.reset-button {
  padding: 0px 29px;
  height: 30px;
}

.pl-date-picker {
  border: 2px solid #785fff;
  border-radius: 10px;
}
</style>
