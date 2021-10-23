<template>
  <q-page class="login-layout">
    <div class="flex column full-width" style="min-height: 100vh">
      <div class="col flex column items-start q-pa-lg upper-section">
        <q-btn
          icon="pl:icon-chevron-left"
          text-color="white"
          to="/home"
          size="lg"
          class="q-pa-none"
          dense
          flat
        />
        <q-space />
        <div class="text-h3 f-bold text-white" style="margin-top: -120px">
          Log In
        </div>
        <q-space />
      </div>

      <div class="q-px-lg q-py-xl">
        <q-form @submit="login" class="q-gutter-y-md">
          <PLFieldInput v-model="email" type="email" field="Email" />
          <PLFieldInput v-model="password" toggleVisibility field="Password">
            <template v-slot:label>
              <router-link class="a-fake f-bold" to="/forgot" tabindex="-1">
                Forgot?
              </router-link>
            </template>
          </PLFieldInput>
          <q-btn
            class="pl-btn full-width q-mb-md q-mt-lg"
            label="Log In"
            color="primary"
            text-color="white"
            :loading="loading"
            type="submit"
          />
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import notify from 'src/components/mixins/notify'
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth'
import { API_URL } from 'src/parameters'

export default defineComponent({
  name: 'PageLogin',
  mixins: [notify],
  data () {
    return {
      email: '',
      password: '',
      loading: false
    }
  },
  methods: {
    login () {
      const app = this
      app.loading = true
      const auth = getAuth()
      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          signInWithEmailAndPassword(auth, app.email, app.password)
            .then((user) => {
              app.loading = false
              this.$api.defaults.baseURL = `${API_URL}/users/${user.user.uid}/`
              this.$router.push('/')
            })
            .catch((err) => {
              console.log(err)
              app.loading = false
              app.showError('Could not sign in', err)
            })
        })
        .catch((err) => {
          app.loading = false
          app.showError('Could not sign in', err)
        })
    }
  }
})
</script>

<style lang="scss">
.login-layout {
  .upper-section {
    background-image: url("../assets/backgrounds/upper.svg");
    background-size: 100% 100%;

    background-repeat: no-repeat;
  }
}
</style>
