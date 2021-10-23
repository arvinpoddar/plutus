export const notify = {
  methods: {
    showSuccess (message, res) {
      if (res) {
        console.log(res)
      }
      this.$q.notify({
        type: 'positive',
        progress: true,
        message: message,
        position: 'top',
        timeout: 1500,
        classes: 'pl-notification',
        actions: [{ icon: 'close', color: 'white' }]
      })
    },

    showError (message, err) {
      if (err) {
        console.log(err)
      }
      this.$q.notify({
        type: 'negative',
        progress: true,
        message: message,
        position: 'top',
        timeout: 1500,
        classes: 'pl-notification',
        actions: [{ icon: 'close', color: 'white' }]
      })
    }
  }
}

export default notify
