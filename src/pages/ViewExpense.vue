<template>
  <q-page class="category-layout">
    <q-form @submit="saveExpense">
      <div
        class="q-px-lg q-py-xl flex column full-width"
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
          <input
            class="col ellipsis header ghost-input"
            v-model="expense.name"
            required
          />
        </div>

        <div class="q-gutter-y-md">
          <PLFieldInput v-model="expense.description" field="Description" />
          <div class="row items-center q-gutter-x-md">
            <PLFieldInput
              v-model="expense.date"
              field="Date"
              type="date"
              class="col"
            />
            <PLMoneyInput
              v-model="expense.price"
              field="Price"
              class="col"
              required
            />
          </div>

          <!-- SELECT CATEGORIES -->
          <div class="pl-stack-input">
            <div class="sl-label">Categories</div>
            <q-select
              outlined
              v-model="categoryBuffer"
              multiple
              :options="categoryOptions"
              use-chips
              stack-label
              class="pl-select sl-input"
              required
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

          <!-- SELECT PAYMENT METHOD -->
          <div class="pl-stack-input">
            <div class="sl-label">Payment method</div>
            <select
              v-model="expense.payment_method"
              class="pl-n-select sl-input"
              required
            >
              <option
                v-for="method in methodOptions"
                :key="method.id"
                :value="method.id"
              >
                {{ method.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="fixed-controls">
        <div class="row items-center q-mb-md q-gutter-x-md">
          <q-btn
            class="pl-btn"
            label="Delete"
            color="negative"
            text-color="white"
            :loading="loading"
            @click="deleteExpense"
          />
          <q-btn
            class="pl-btn col"
            label="Save"
            color="primary"
            text-color="white"
            :loading="loading"
            type="submit"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import dayjs from 'dayjs'
import notify from 'src/components/mixins/notify'
import format from 'src/components/mixins/format'

export default defineComponent({
  name: 'PageViewExpense',
  mixins: [notify, format],
  data () {
    return {
      expense: {
        name: '',
        description: '',
        date: dayjs().format('YYYY-MM-DD'),
        price: 0,
        categories: [],
        payment_method: ''
      },

      categoryBuffer: [],

      categoryOptions: [],
      methodOptions: [],

      loading: false
    }
  },
  methods: {
    async getOptions () {
      try {
        // Fetch all categories and automatically add the current one (if it is valid)
        this.categoryOptions = (await this.$api.get('/categories')).data
        // Fetch all payment methods
        this.methodOptions = (await this.$api.get('/payment-methods')).data
      } catch (err) {
        this.showError('Could not fetch this category', err)
      }
    },

    async getExpense () {
      try {
        // Fetch current expense
        const id = this.$route.params.expenseId
        this.expense = (await this.$api.get(`/expenses/${id}`)).data
        this.expense.date = this.formatDate(this.expense.date, 'YYYY-MM-DD')
        this.categoryBuffer = this.expense.categories.map((cat) => {
          return this.categoryOptions.find((obj) => obj.id === cat)
        })
      } catch (err) {
        this.showError('Could not fetch expense', err)
      }
    },

    async saveExpense () {
      try {
        this.loading = true
        const selectedCategories = this.categoryBuffer.map((cat) => cat.id)
        if (!selectedCategories.length) {
          return this.showError('Add a category for your expense', null)
        }
        const body = {
          ...this.expense,
          date: dayjs(this.expense.date).toISOString(),
          categories: selectedCategories
        }
        const id = this.$route.params.expenseId
        await this.$api.put(`/expenses/${id}`, body)
        this.goBack()
      } catch (err) {
        this.showError('Could not save expense', err)
      } finally {
        this.loading = false
      }
    },

    deleteExpense () {
      this.$q
        .dialog({
          title: 'Delete',
          message: 'Are you sure you want to delete this expense?',
          cancel: true
        })
        .onOk(async () => {
          try {
            this.loading = true
            const id = this.$route.params.expenseId
            await this.$api.delete(`/expenses/${id}`)
            // After successful API POST, send back to view category page
            this.goBack()
          } catch (err) {
            this.showError('Could not delete expense', err)
          } finally {
            this.loading = false
          }
        })
    },

    goBack () {
      this.$router.go(-1)
    }
  },

  async mounted () {
    await this.getOptions()
    await this.getExpense()
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

  .ghost-input {
    background-color: transparent;
    border: 0px;
    outline: 0px;
    margin: 0px;
    padding: 0px;
  }

  .category-card {
    padding: 12px;
    cursor: pointer;
    margin-bottom: 16px;
    font-size: 20px;
    font-weight: 600;
  }
}
</style>
