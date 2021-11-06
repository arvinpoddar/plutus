<template>
  <q-carousel
    animated
    v-model="slide"
    navigation
    class="q-mb-md pl-carousel"
    v-if="images.length"
  >
    <q-carousel-slide
      v-for="(image, index) of images"
      :key="image"
      :name="index"
      :img-src="image"
    />
  </q-carousel>

  <div class="add-slide flex flex-center" v-else>
    <div>
      <q-icon size="75px" class="q-mb-md" name="pl:icon-photos" color="white" />
      <div class="empty-message text-white" @click="addImage">
        Tap to add image
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExpenseImages',
  props: {
    images: Array,
    expenseId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      slide: 0
    }
  },
  methods: {
    addImage () {}
  }
}
</script>

<style lang="scss">
.pl-carousel {
  height: 300px;
}

.add-slide {
  height: 300px;
  margin-bottom: 20px;
  background: #8f78fe;
  width: 100%;
  text-align: center;

  .empty-message {
    font-size: 18px;
  }
}
</style>
