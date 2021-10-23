export const notify = {
  methods: {
    showSuccess (message, res) {
      if (res) {
        console.log(res)
      }
      this.$q.notify({
        type: 'positive',
        message: message,
        position: 'top'
      })
    },

    showError (message, err) {
      if (err) {
        console.log(err)
      }
      this.$q.notify({
        type: 'negative',
        message: message,
        position: 'top'
      })
    }
  }
}

export default notify
