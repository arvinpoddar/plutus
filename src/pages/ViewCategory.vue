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

      <q-slide-item
        v-for="expense in category.expenses"
        :key="expense.id"
        @right="deleteExpense(expense.id)"
        @click="viewExpense(expense.id)"
        right-color="negative"
        class="pl-card q-mb-md"
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
    },

    viewExpense (id) {
      this.$router.push(`/expense/${id}/`)
    },

    deleteExpense (id) {
      const reset = () => {
        if (this.$refs[id]) {
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
