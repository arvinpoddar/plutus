<template>
  <Loader v-if="loading" />
  <q-page class="category-layout fixed-layout" v-else>
    <div
      class="q-px-lg q-py-xl flex column full-width"
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
          <MainChart :expenses="category.expenses" />
        </div>
      </div>

      <!-- SEARCH BAR -->
      <PLFieldInput v-model="search" placeholder="Search..." class="q-mb-sm">
        <template v-slot:append>
          <q-icon name="pl:icon-schedule" class="cursor-pointer" @click="prompt = true">
            <q-dialog v-model="prompt" position="bottom">
              <q-card style="min-width: 350px">
                <div class = "dialog-header-box">
                <!-- <q-card-actions class="text-primary">
                   <div class="text-h6">Filter</div>
        </q-card-actions> -->
                <q-card-actions align="right" class="text-primary">
                   <!-- <div class="text-h6">Filter</div> -->
          <q-btn flat round icon="close" v-close-popup @click ="prompt = false"/>
        </q-card-actions>
        </div>
                <q-card-section style = "margin: -40px">
                  <div class="q-pa-lg">
                    <q-option-group
                        v-model="dateChoice"
                        :options="options"
                        color="primary"
                    />
                </div>
                </q-card-section>
                <q-card-section v-if="dateChoice=== 'dateRange'" class="q-pt-none">
                  <div id="q-app" style = "margin-top: -55px">
                    <div class="q-pa-md">
                      <!-- you can remove the header by adding minimal prompt -->
                      <q-date v-model="model" range ></q-date>
                     </div>
                  </div>
                   <!-- <q-list v-if="dateChoice=== 'dateRange'" class="q-py-md" style="min-width: 100px">
                <q-item>
                  <q-item-section>
                    From:
                    <PLFieldInput type="date" v-model="startDate" />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    To:
                    <PLFieldInput type="date" v-model="endDate" />
                  </q-item-section>
                </q-item>
                <div class="row justify-end">
                  <q-btn
                    label="Reset"
                    color="negative"
                    class="pl-btn q-mr-md q-mt-sm reset-button"
                    @click="resetDateFilters"
                  />
                </div>
              </q-list> -->
                </q-card-section>
      </q-card>
            </q-dialog>
            <!-- <q-menu>
                  <div class="q-pa-lg">
                    <q-option-group
                        v-model="dateChoice"
                        :options="options"
                        color="primary"
                    />
                </div>
              <q-list v-if="dateChoice=== 'dateRange'" class="q-py-md" style="min-width: 100px">
                <q-item>
                  <q-item-section>
                    From:
                    <PLFieldInput type="date" v-model="startDate" />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    To:
                    <PLFieldInput type="date" v-model="endDate" />
                  </q-item-section>
                </q-item>
                <div class="row justify-end">
                  <q-btn
                    label="Reset"
                    color="negative"
                    class="pl-btn q-mr-md q-mt-sm reset-button"
                    @click="resetDateFilters"
                  />
                </div>
              </q-list>
            </q-menu> -->

          </q-icon>
        </template>
      </PLFieldInput>

      <q-slide-item
        v-for="expense in searchResults"
        :key="expense.id + startDate"
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
</template>

<script>
import { defineComponent, ref } from 'vue'
import { date } from 'quasar'
import notify from 'src/components/mixins/notify'
import format from 'src/components/mixins/format'

import MainChart from 'src/components/chart/MainChart'

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
      options: [
        {
          label: 'Previous 7 days',
          value: 'week'
        },
        {
          label: 'This month',
          value: 'month'
        },
        {
          label: 'Date Range',
          value: 'dateRange'
        }
      ],
      prompt: ref(false),

      search: '',
      startDate: '',
      endDate: '',
      dateChoice: '',
      model: ref({ from: '', to: '' }),
      loading: true
    }
  },
  computed: {
    filteredByDate () {
      // Filter initial expense list by dates (if date filters are present)
      if (this.dateChoice === 'dateRange') {
        const minDate = this.model.from
          ? new Date(this.model.from)
          : new Date('1970-01-01')
        const maxDate = this.model.to ? new Date(this.model.to) : new Date()

        const expensesWithinDates = this.category.expenses.filter((expense) => {
          const expenseDate = new Date(expense.date)
          return expenseDate >= minDate && expenseDate <= maxDate
        })
        return expensesWithinDates
      } else if (this.dateChoice === 'week') {
        const maxDate = Date.now()
        const minDate = date.subtractFromDate(maxDate, { days: 7 })
        const expensesWithinDates = this.category.expenses.filter((expense) => {
          const expenseDate = new Date(expense.date)
          return expenseDate >= minDate && expenseDate <= maxDate
        })
        return expensesWithinDates
      } else if (this.dateChoice === 'month') {
        const currDate = Date.now()
        const expensesWithinDates = this.category.expenses.filter((expense) => {
          const expenseDate = new Date(expense.date)
          return date.isSameDate(expenseDate, currDate, 'month')
        })
        return expensesWithinDates
      }

      // const minDate = this.startDate
      //   ? new Date(this.startDate)
      //   : new Date('1970-01-01')
      // const maxDate = this.endDate ? new Date(this.endDate) : new Date()

      // const expensesWithinDates = this.category.expenses.filter((expense) => {
      //   const expenseDate = new Date(expense.date)
      //   return expenseDate >= minDate && expenseDate <= maxDate
      // })
      return this.category.expenses
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
      this.category.expenses.forEach((expense) => {
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
      this.startDate = ''
      this.endDate = ''
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
.dialog-header-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
