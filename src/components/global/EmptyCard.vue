<template>
  <div class="empty-card">
    <q-icon size="100px" name="pl:icon-inbox" color="grey-4" />
    <div class="empty-message text-grey-6">{{ message }}</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EmptyCard',
  props: {
    message: String
  }
})
</script>

<style lang="scss">
.empty-card {
  width: 100%;
  margin: 50px auto;
  text-align: center;

  .empty-message {
    font-size: 18px;
  }
}
</style>
