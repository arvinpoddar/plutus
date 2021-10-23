<template>
  <div class="pl-stack-input">
    <div class="row items-center sl-label" v-if="field">
      <div class="col">{{ field }}</div>
      <slot name="label"></slot>
    </div>
    <q-input
      v-bind="$attrs"
      :type="inputType"
      :modelValue="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :class="{
        'pl-input': true,
        'sl-input': !!field,
        'pl-prefix-input': !!$attrs.prefix,
      }"
      outlined
      autocomplete="on"
    >
      <template v-slot:append>
        <q-icon
          v-if="toggleVisibility"
          :name="showPassword ? 'pl:icon-not-visible' : 'pl:icon-view-fill-2'"
          class="cursor-pointer"
          @click="showPassword = !showPassword"
        />
        <slot name="append"></slot>
      </template>
    </q-input>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'IGFieldInput',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: null
    },
    field: {
      type: String
    },
    toggleVisibility: {
      type: Boolean
    }
  },
  data () {
    return {
      showPassword: false
    }
  },
  computed: {
    inputType () {
      if (this.toggleVisibility) {
        return this.showPassword ? 'text' : 'password'
      }
      return this.$attrs.type || 'text'
    }
  }
})
</script>
