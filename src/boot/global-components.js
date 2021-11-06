import { boot } from 'quasar/wrappers'
import PLFieldInput from 'src/components/global/PLFieldInput'
import PLDateInput from 'src/components/global/PLDateInput'
import PLMoneyInput from 'src/components/global/PLMoneyInput'
import PLTextArea from 'src/components/global/PLTextArea'
import EmptyCard from 'src/components/global/EmptyCard'
import Loader from 'src/components/global/Loader'

export default boot(({ app }) => {
  app.component('PLFieldInput', PLFieldInput)
  app.component('PLDateInput', PLDateInput)
  app.component('PLMoneyInput', PLMoneyInput)
  app.component('PLTextArea', PLTextArea)
  app.component('EmptyCard', EmptyCard)
  app.component('Loader', Loader)
})
