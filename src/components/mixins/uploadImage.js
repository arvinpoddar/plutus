export const UPLOAD_EVENT = 'upload'

export const uploadImage = {
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
        return res.url
      } catch (err) {
        this.showError(err, 'Could not upload image')
      } finally {
        this.loading = false
      }
    }

  }
}

export default uploadImage
