<template>
  <q-page class="onboard-payments-layout">
    <div
      class="q-px-lg q-py-lg flex column full-width"
      style="min-height: 100vh"
    >
      <div class="header">Payment Types</div>
      <div class="subheader q-mb-lg">
        Add some of your common payment methods, like a card or account. You can
        add more later.
      </div>

      <div class="col overflow-scroll">
        <!-- LIST OF PAYMENT METHODS -->
        <OnboardingRow
          v-for="method in methods"
          :key="method.id"
          :title="method.name"
          @delete="deletePaymentMethod(method.id)"
        />
        <EmptyCard v-if="!methods.length" message="No payment methods!" />
      </div>
    </div>
    <div class="fixed-controls">
      <div class="row q-gutter-x-md q-mb-md">
        <PLFieldInput
          v-model="newMethod"
          placeholder="Payment type"
          class="col"
        />
        <q-btn
          class="pl-btn-icn"
          color="primary"
          text-color="white"
          icon="pl:icon-plus"
          @click="addPaymentMethod"
          :loading="loading"
        />
      </div>
      <q-btn
        class="pl-btn full-width q-mb-md"
        label="Next"
        color="primary"
        text-color="white"
        :disable="!methods.length"
        to="/login"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import notify from 'src/components/mixins/notify'
import OnboardingRow from 'src/components/onboarding/OnboardingRow'

export default defineComponent({
  name: 'PageOnboardPaymentMethods',
  mixins: [notify],
  components: {
    OnboardingRow
  },
  data () {
    return {
      methods: [],
      newMethod: '',
      loading: false
    }
  },
  methods: {
    async getPaymentMethods () {
      try {
        this.loading = true
        this.methods = (await this.$api.get('/payment-methods')).data
      } catch (err) {
        this.showError('Could not fetch your payment methods', err)
      } finally {
        this.loading = false
      }
    },

    async addPaymentMethod () {
      try {
        this.loading = true
        const res = await this.$api.post('/payment-methods/', {
          name: this.newMethod
        })
        this.methods.push(res.data)
        this.newMethod = ''
      } catch (err) {
        this.showError('Could not add payment method', err)
      } finally {
        this.loading = false
      }
    },

    async deletePaymentMethod (id) {
      try {
        await this.$api.delete(`/payment-methods/${id}`)
        this.methods = this.methods.filter((method) => method.id !== id)
      } catch (err) {
        this.showError('Could not delete payment method', err)
      }
    }
  },

  mounted () {
    this.getPaymentMethods()
  }
})
</script>

<style lang="scss">
.onboard-payments-layout {
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

  .input-controls {
    background-color: #fff;
    border-top: 2px solid #f1f1f5;
    width: 100%;
    position: fixed;
    bottom: 0;
    padding: 20px;
  }
}
</style>
