<template>
  <q-page class="dashboard-layout">
    <div
      class="q-px-lg q-py-xl flex column full-width"
      style="min-height: 100vh"
    >
      <div class="row q-mb-md">
        <div class="col header">Home</div>
        <q-btn icon="logout" color="black" flat dense @click="logout" />
      </div>

      <Loader v-if="loading" />

      <!-- CATEGORIES LIST -->
      <div v-else>
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="row pl-card category-card"
          @click="viewCategory(cat.id)"
        >
          <div class="col ellipsis">{{ cat.name }}</div>
          <div>{{ numToDollar(cat.total_expenses) }}</div>
        </div>

        <EmptyCard v-if="!categories.length" message="No categories!" />
      </div>
    </div>
    <div class="fixed-controls">
      <q-btn
        class="pl-btn full-width q-mb-md"
        label="Add Category"
        color="primary"
        text-color="white"
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

export default defineComponent({
  name: 'PageDashboard',
  mixins: [notify, format],
  data () {
    return {
      categories: [],
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

    viewCategory (id) {
      this.$router.push(`/category/${id}`)
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

  mounted () {
    this.getCategories()
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
    padding: 12px;
    cursor: pointer;
    margin-bottom: 16px;
    font-size: 20px;
    font-weight: 600;
  }
}
</style>
