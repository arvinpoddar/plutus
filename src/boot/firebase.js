import { boot } from 'quasar/wrappers'
import { initializeApp } from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAFHn-1tU8hGcBmTaM6Nc8y6LEy7ysDLns',
  authDomain: 'plutus-80602.firebaseapp.com',
  projectId: 'plutus-80602',
  storageBucket: 'plutus-80602.appspot.com',
  messagingSenderId: '145591051590',
  appId: '1:145591051590:web:ba6dc342489c059cfcf147'
}

const fb = initializeApp(firebaseConfig)

export default boot(({ app }) => {
  app.config.globalProperties.$fb = fb
})
