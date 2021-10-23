<template>
  <div class="ig-stack-input">
    <div class="row items-center sl-label" v-if="field">
      <div class="col">{{ field }}</div>
      <slot name="label"></slot>
    </div>
    <input
      ref="inputRef"
      :value="formattedValue"
      :class="{
        'ig-input ig-raw-input': true,
        'sl-input': !!field,
      }"
    />
  </div>
</template>

<script>
import { useCurrencyInput } from 'vue-currency-input'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CurrencyInput',
  props: {
    modelValue: Number,
    field: String
  },
  setup (props) {
    const options = {
      currency: 'USD',
      locale: 'en-US',
      precision: 2,
      valueRange: { min: 0, max: 1000000000 },
      useGrouping: true,
      hideGroupingSeparatorOnFocus: false,
      hideCurrencySymbolOnFocus: false
    }

    const currencyInput = useCurrencyInput(options)

    const inputRef = currencyInput.inputRef
    const formattedValue = currencyInput.formattedValue

    return { currencyInput, inputRef, formattedValue }
  },
  data () {
    return {
      key: 1
    }
  },
  watch: {
    modelValue (val) {
      this.currencyInput.setValue(val)
    }
  }
})
</script>
