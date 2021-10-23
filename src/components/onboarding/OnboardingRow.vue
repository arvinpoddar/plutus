<template>
  <div class="row items-center pl-card onboarding-row">
    <div class="col row-title">{{ title }}</div>
    <q-btn
      icon="pl:icon-trash"
      text-color="negative"
      dense
      flat
      @click="deleteRow"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

const DELETE_EVENT = 'delete'

export default defineComponent({
  name: 'OnboardingRow',
  emits: [DELETE_EVENT],
  props: {
    title: String
  },
  methods: {
    deleteRow () {
      this.$emit(DELETE_EVENT)
    }
  }
})
</script>

<style lang="scss">
.onboarding-row {
  padding: 12px 11px;
  margin-bottom: 16px;

  .row-title {
    font-size: 16px;
    font-weight: 500;
  }
}

.onboarding-row:last-of-type {
  margin-bottom: 0px;
}
</style>
