<template>
  <div class="ig-stack-input">
    <div class="row items-center sl-label">
      <div class="col">{{ field }}</div>
      <slot name="label"></slot>
    </div>
    <q-input
      v-bind="$attrs"
      :modelValue="formattedDate"
      @update:model-value="setDate"
      mask="##/##/####"
      fill-mask="-"
      :class="{
        'ig-input': true,
        'sl-input': !!field,
      }"
      outlined
    >
      <!--
      :error="!date"
      hide-bottom-space
      no-error-icon
      lazy-rules="ondemand"
      -->
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="date"
              mask="YYYY-MM-DD"
              @update:model-value="emitToParent"
              required
              no-unset
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { defineComponent } from 'vue'

const VALUE_FORMAT = 'YYYY-MM-DD'
const DISPLAY_FORMAT = 'MM/DD/YYYY'

export default defineComponent({
  name: 'IGDateInput',
  emits: ['update:model-value'],
  props: ['modelValue', 'field'],
  data () {
    return {
      date: ''
    }
  },
  computed: {
    formattedDate () {
      return dayjs(this.date).format(DISPLAY_FORMAT)
    }
  },
  methods: {
    setDate (val) {
      const date = dayjs(val, DISPLAY_FORMAT)
      if (date.isValid()) {
        this.date = date.format(VALUE_FORMAT)
      } else if (val.length === DISPLAY_FORMAT.length) {
        this.date = ''
      }
      this.emitToParent(this.date)
    },

    emitToParent (e) {
      const date = dayjs(e, DISPLAY_FORMAT)
      if (date.isValid()) {
        this.$emit('update:model-value', date.format(VALUE_FORMAT))
      } else {
        this.date = ''
        this.$emit('update:model-value', '')
      }
    }
  },
  watch: {
    modelValue (val) {
      if (val) {
        this.date = dayjs(val).format(VALUE_FORMAT)
      }
    }
  }
})
</script>
