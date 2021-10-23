<template>
  <q-page class="sign-up-layout">
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
          Sign Up
        </div>
        <q-space />
      </div>

      <div class="q-px-lg q-py-xl">
        <q-form class="q-gutter-y-md">
          <div class="row q-gutter-x-md">
            <PLFieldInput v-model="first_name" class="col" field="First Name" />
            <PLFieldInput v-model="last_name" class="col" field="Last Name" />
          </div>
          <PLFieldInput v-model="email" type="email" field="Email" />
          <PLFieldInput v-model="password" toggleVisibility field="Password" />
          <q-btn
            class="pl-btn full-width q-mb-md q-mt-lg"
            label="Sign Up"
            color="primary"
            text-color="white"
            to="/login"
          />
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageLogin',
  data () {
    return {
      first_name: '',
      last_name: '',
      email: '',
      password: ''
    }
  }
})
</script>

<style lang="scss">
.sign-up-layout {
  .upper-section {
    background-image: url("../assets/backgrounds/upper.svg");
    background-size: 100% 100%;

    background-repeat: no-repeat;
  }
}
</style>
