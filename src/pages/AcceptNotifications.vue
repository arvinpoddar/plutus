<template>
  <q-page class="main-layout">
    <div
      class="q-px-lg q-py-xl flex column full-width"
      style="min-height: 100vh"
    >
      <q-space />

      <div class="full-width text-center">
        <img src="~assets/rocket.png" alt="" style="width: 90%" />
      </div>

      <q-space />

      <div>
        <div class="text-h3 f-bold text-white">Notifications</div>
        <div class="text-h6 text-white q-mb-lg">
          We use notifications to remind you to add expenses. When prompted,
          allow notifications.
        </div>
        <q-btn
          class="pl-btn full-width q-mb-md"
          label="Got it!"
          color="white"
          text-color="primary"
          to="/onboard-categories"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageIndex'
})
</script>

<style lang="scss">
.main-layout {
  background-image: url("../assets/backgrounds/main.svg");
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
