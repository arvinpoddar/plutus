<template>
  <q-page class="category-layout">
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

      <div class="pl-card q-pa-md q-mb-lg">
        <div class="text-h6 f-bold">
          Total: {{ numToDollar(category.total_expenses) }}
        </div>
      </div>

      <PLFieldInput v-model="search" placeholder="Search..." class="q-mb-sm" />

      <div
        v-for="expense in category.expenses"
        :key="expense.id"
        class="row pl-card expense-card"
      >
        <div class="col ellipsis">
          <div class="expense-name">{{ expense.name }}</div>
          <div class="expense-date">
            {{ formatDate(expense.date, "MM/DD/YYYY") }}
          </div>
        </div>
        <div class="expense-price">
          {{ formatAmount(expense.price, "dollar") }}
        </div>
      </div>
      <EmptyCard v-if="!category.expenses.length" message="No expenses!" />
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
import { defineComponent } from 'vue'
import notify from 'src/components/mixins/notify'
import format from 'src/components/mixins/format'

export default defineComponent({
  name: 'PageViewCategory',
  mixins: [notify, format],
  data () {
    return {
      category: {
        name: '',
        expenses: [],
        total_expenses: 0
      },

      search: ''
    }
  },
  methods: {
    async getCategory () {
      try {
        this.loading = true
        const id = this.$route.params.categoryId
        const data = (await this.$api.get(`/categories/${id}`)).data
        this.category = Object.assign(this.category, data)
      } catch (err) {
        this.showError('Could not fetch this category', err)
      } finally {
        this.loading = false
      }
    },

    addExpense () {
      const id = this.$route.params.categoryId
      this.$router.push(`/category/${id}/add-expense`)
    }
  },

  mounted () {
    this.getCategory()
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

  .expense-card {
    padding: 12px;
    cursor: pointer;
    margin-bottom: 16px;
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
</style>
