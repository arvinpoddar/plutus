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

  <!-- Upload Image Slide -->
  <div class="add-slide flex flex-center" @click="addImageFromLibrary" v-else>
    <div>
      <q-icon size="75px" class="q-mb-md" name="pl:icon-photos" color="white" />
      <div class="empty-message text-white">Tap to add image</div>
    </div>
  </div>
</template>

<script>
import notify from 'src/components/mixins/notify'

const UPLOAD_EVENT = 'upload'
const DELETE_EVENT = 'delete'

export default {
  name: 'ExpenseImages',
  emits: [UPLOAD_EVENT, DELETE_EVENT],
  mixins: [notify],
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
    addImageFromLibrary () {
      navigator.camera.getPicture(
        (data) => {
          this.uploadImageUrlToS3(`data:image/jpeg;base64,${data}`)
        },
        (err) => {
          console.error(err)
        },
        {
          quality: 30,
          destinationType: navigator.camera.DestinationType.DATA_URL,
          encodingType: navigator.camera.EncodingType.JPEG,
          MEDIATYPE: navigator.camera.MediaType.PICTURE,
          sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
          mediaType: navigator.camera.MediaType.PICTURE,
          cameraDirection: navigator.camera.Direction.BACK
        }
      )
    },

    async uploadImageUrlToS3 (url) {
      try {
        this.loading = true
        const res = (
          await this.$api.post('/images', {
            base64: url
          })
        ).data
        this.$emit(UPLOAD_EVENT, res.url)
      } catch (err) {
        this.showError(err, 'Could not upload image')
      } finally {
        this.loading = false
      }
    },

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
