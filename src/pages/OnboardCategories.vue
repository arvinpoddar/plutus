<template>
  <q-page class="onboard-categories-layout">
    <div
      class="q-px-lg q-py-xl flex column full-width"
      style="min-height: 100vh"
    >
      <div class="header">Categories</div>
      <div class="subheader q-mb-lg">
        Create categories for your expenses. You can add more later.
      </div>

      <div class="col overflow-scroll">
        <!-- LIST OF CATEGORIES -->
        <OnboardingRow
          v-for="cat in categories"
          :key="cat.id"
          :title="cat.name"
          @delete="deleteCategory(cat.id)"
        />
        <EmptyCard v-if="!categories.length" message="No categories!" />
      </div>
    </div>
    <div class="fixed-controls">
      <div class="row q-gutter-x-md q-mb-md">
        <PLFieldInput
          v-model="newCategory"
          placeholder="Category name"
          class="col"
        />
        <q-btn
          class="pl-btn-icn"
          color="primary"
          text-color="white"
          icon="pl:icon-plus"
          @click="addCategory"
          :loading="loading"
        />
      </div>
      <q-btn
        class="pl-btn full-width q-mb-md"
        label="Next"
        color="primary"
        text-color="white"
        :disable="!categories.length"
        to="/onboard-payments"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import notify from 'src/components/mixins/notify'
import OnboardingRow from 'src/components/onboarding/OnboardingRow'

export default defineComponent({
  name: 'PageOnboardCategories',
  mixins: [notify],
  components: {
    OnboardingRow
  },
  data () {
    return {
      categories: [],
      newCategory: '',
      loading: false
    }
  },
  methods: {
    async getCategories () {
      try {
        this.loading = true
        this.categories = (await this.$api.get('/categories')).data
      } catch (err) {
        this.showError('Could not fetch your categories', err)
      } finally {
        this.loading = false
      }
    },

    async addCategory () {
      try {
        this.loading = true
        const res = await this.$api.post('/categories/', {
          name: this.newCategory
        })
        this.categories.push(res.data)
        this.newCategory = ''
      } catch (err) {
        this.showError('Could not add category', err)
      } finally {
        this.loading = false
      }
    },

    async deleteCategory (id) {
      try {
        await this.$api.delete(`/categories/${id}`)
        this.categories = this.categories.filter((cat) => cat.id !== id)
      } catch (err) {
        this.showError('Could not delete category', err)
      }
    }
  },

  mounted () {
    this.getCategories()
  }
})
</script>

<style lang="scss">
.onboard-categories-layout {
  .header {
    font-weight: bold;
    font-size: 36px;
    line-height: 54px;
  }

  .subheader {
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    color: #92929d;
  }
}
</style>
