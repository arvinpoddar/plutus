<template>
  <!-- LOADING SLIDE -->
  <div class="add-slide flex flex-center" v-if="loading">
    <div>
      <q-spinner size="75px" class="q-mb-md" color="white" />
    </div>
  </div>

  <div v-else-if="images.length" class="carousel-container q-mb-md">
    <q-btn
      icon="add"
      color="primary"
      class="add-btn"
      round
      size="sm"
      @click.stop="addImageFromLibrary"
    />
    <q-carousel
      animated
      v-model="slide"
      swipeable
      navigation
      class="pl-carousel"
    >
      <q-carousel-slide
        v-for="(image, index) of images"
        :key="image"
        :name="index"
        :img-src="image"
      >
        <q-btn
          icon="clear"
          color="grey"
          class="delete-btn"
          round
          flat
          @click.stop="deleteImage(image)"
        />
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script>
import notify from 'src/components/mixins/notify'
import uploadImage, { UPLOAD_EVENT } from 'src/components/mixins/uploadImage'

const DELETE_EVENT = 'delete'

export default {
  name: 'ExpenseImages',
  emits: [UPLOAD_EVENT, DELETE_EVENT],
  mixins: [notify, uploadImage],
  props: {
    images: Array
  },
  data () {
    return {
      slide: 0,
      loading: false
    }
  },
  methods: {
    deleteImage (url) {
      this.$emit(DELETE_EVENT, url)
    }
  }
}
</script>

<style lang="scss">
.carousel-container {
  position: relative;
  .add-btn {
    position: absolute;
    bottom: 12px;
    right: 12px;
    z-index: 1;
  }
  .delete-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 1;
  }
}
.pl-carousel {
  height: 350px;
}

.add-slide {
  height: 350px;
  margin-bottom: 20px;
  background: #8f78fe;
  width: 100%;
  text-align: center;

  .empty-message {
    font-size: 18px;
  }
}
</style>
