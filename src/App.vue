<template>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  created () {
    this.$q.iconMapFn = (iconName) => {
      // iconName is the content of QIcon "name" prop
      // custom icon names will look like: ig:icon-{name}
      const prefix = 'pl:'
      if (iconName.startsWith(prefix)) {
        // we strip the "q:" part
        const name = iconName.substring(prefix.length)
        return {
          cls: name
        }
      }
    }
  }
})
</script>
