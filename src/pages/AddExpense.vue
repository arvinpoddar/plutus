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
          <div class="col ellipsis header">Add Expense</div>
        </div>

        <div class="q-gutter-y-md">
          <PLFieldInput v-model="res.name" field="Name" required />
          <PLFieldInput v-model="res.description" field="Description" />
          <div class="row items-center q-gutter-x-md">
            <PLFieldInput
              v-model="res.date"
              field="Date"
              type="date"
              class="col"
            />
            <PLMoneyInput
              v-model="res.price"
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
              v-model="res.categories"
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

          <!-- SELECT PAYMENT METHOD -->
          <div class="pl-stack-input">
            <div class="sl-label">Payment method</div>
            <select
              v-model="res.payment_method"
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
        <q-btn
          class="pl-btn full-width q-mb-md"
          label="Save"
          color="primary"
          text-color="white"
          :loading="loading"
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

export default defineComponent({
  name: 'PageViewCategory',
  mixins: [notify],
  data () {
    return {
      res: {
        name: '',
        description: '',
        date: dayjs().format('YYYY-MM-DD'),
        price: 0,
        categories: [],
        payment_method: ''
      },
      categoryOptions: [],
      methodOptions: [],
      loading: false
    }
  },
  methods: {
    async getOptions () {
      try {
        // Fetch all categories and automatically add the current one (if it is valid)
        const id = this.$route.params.categoryId
        this.categoryOptions = (await this.$api.get('/categories')).data
        const currentCategory = this.categoryOptions.find(
          (cat) => cat.id === id
        )
        if (currentCategory) {
          this.res.categories.push(currentCategory)
        }

        // Fetch all payment methods
        this.methodOptions = (await this.$api.get('/payment-methods')).data
      } catch (err) {
        this.showError('Could not fetch this category', err)
      }
    },

    async saveExpense () {
      try {
        this.loading = true
        const selectedCategories = this.res.categories.map((cat) => cat.id)
        if (!selectedCategories.length) {
          return this.showError('Add a category for your expense', null)
        }
        const body = {
          ...this.res,
          date: dayjs(this.res.date).toISOString(),
          categories: selectedCategories,
          images: []
        }
        await this.$api.post('/expenses/', body)

        // After successful API POST, send back to category page
        const id = this.$route.params.categoryId
        this.$router.push(`/category/${id || ''}`)
      } catch (err) {
        this.showError('Could not add expense', err)
      } finally {
        this.loading = false
      }
    },

    goBack () {
      this.$router.go(-1)
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

  .category-card {
    padding: 12px;
    cursor: pointer;
    margin-bottom: 16px;
    font-size: 20px;
    font-weight: 600;
  }
}
</style>
