<template>
  <q-page class="dashboard-layout fixed-layout">
    <div
      class="q-px-lg q-py-lg flex column full-width"
      style="min-height: 100vh"
    >
      <div class="row q-mb-md">
        <div class="col header">Home</div>
        <q-btn icon="logout" color="black" flat dense @click="logout" />
      </div>

      <Loader v-if="loading" />

      <!-- CATEGORIES LIST -->
      <div v-else>
        <div class="row pl-card category-card" @click="viewCategory('')">
          <div class="col ellipsis">Total</div>
          <div>{{ numToDollar(totalExpenses) }}</div>
          <div class="chart-container" style="height: 125px">
            <FlatChart :expenses="allExpenses" />
          </div>
          <q-btn
            icon="add"
            color="primary"
            class="fab-btn"
            round
            size="xs"
            @click.stop="addExpense('')"
          />
        </div>

        <q-separator inset class="q-my-lg" />

        <div
          v-for="cat in categories"
          :key="cat.id"
          class="pl-card category-card"
          @click="viewCategory(cat.id)"
        >
          <div class="row">
            <div class="col ellipsis">{{ cat.name }}</div>
            <div>{{ numToDollar(cat.total_expenses) }}</div>
          </div>
          <div class="row">
            <div class="col chart-container" style="height: 75px">
              <FlatChart :expenses="cat.expenses" />
            </div>
            <q-btn
              icon="add"
              color="primary"
              class="fab-btn"
              round
              size="xs"
              @click.stop="addExpense(cat.id)"
            />
          </div>
        </div>

        <EmptyCard v-if="!categories.length" message="No categories!" />
      </div>
    </div>
    <div class="fixed-controls row q-gutter-x-md">
      <q-btn
        class="pl-btn q-mb-md"
        label="Export"
        color="primary"
        text-color="white"
        to="/export"
      />
      <q-btn
        class="pl-btn-icn col q-mb-md"
        label="Add Expense"
        color="primary"
        text-color="white"
        to="/add-expense"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import notify from 'src/components/mixins/notify'
import format from 'src/components/mixins/format'
import { getAuth, signOut } from 'firebase/auth'
import { API_URL } from 'src/parameters'

import FlatChart from 'src/components/chart/FlatChart'

export default defineComponent({
  name: 'PageDashboard',
  mixins: [notify, format],
  components: {
    FlatChart
  },
  data () {
    return {
      categories: [],
      allExpenses: [],
      loading: false
    }
  },
  computed: {
    totalExpenses () {
      let sum = 0
      this.allExpenses.forEach((expense) => {
        sum += expense.price
      })
      return sum
    }
  },
  methods: {
    async getExpenses () {
      try {
        this.allExpenses = (await this.$api.get('/expenses')).data
      } catch (err) {
        this.showError('Could not fetch your expenses', err)
      }
    },

    async getCategories () {
      try {
        this.categories = (await this.$api.get('/categories')).data
      } catch (err) {
        this.showError('Could not fetch your categories', err)
      }
    },

    viewCategory (id) {
      this.$router.push(`/category/${id}`)
    },

    addExpense (id) {
      this.$router.push(`/add-expense/${id}`)
    },

    logout () {
      const auth = getAuth()
      signOut(auth)
        .then(() => {
          // RESET BASE URL AND GO HOME
          this.$api.defaults.baseURL = API_URL
          this.$router.push('/home')
        })
        .catch((error) => {
          this.showError('Could not logout', error)
        })
    }
  },

  async mounted () {
    try {
      this.loading = true
      await this.getCategories()
      await this.getExpenses()
    } finally {
      this.loading = false
    }
  }
})
</script>

<style lang="scss">
.dashboard-layout {
  .header {
    font-weight: bold;
    font-size: 36px;
    line-height: 54px;
  }

  .category-card {
    position: relative;
    padding: 12px 12px 0px 12px;
    cursor: pointer;
    margin-bottom: 24px;
    font-size: 20px;
    font-weight: 600;

    .chart-container {
      width: 100%;
    }

    .fab-btn {
      position: absolute;
      right: 8px;
      bottom: 8px;
    }
  }
}
</style>
