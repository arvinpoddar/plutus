import dayjs from 'dayjs'

export const format = {
  methods: {
    numToDollar (amount, toInteger = false) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: toInteger ? 0 : 2
      })

      return formatter.format(amount)
    },

    formatAmount (amount = 0, type = 'dollar', signed = false) {
      let res = Math.abs(amount)
      if (type === 'dollar') {
        res = `${this.numToDollar(res)}`
      } else if (type === 'percent') {
        res *= 100
        res = `${res.toFixed(2)}%`
      }

      if (signed) {
        if (amount >= 0) {
          res = '+' + res
        } else {
          res = '-' + res
        }
      }

      return res
    },

    formatDate (string, format) {
      return dayjs(string).format(format)
    }
  }
}

export default format
