import 'virtual:windi.css'

import App from './App'
import GlobalStyle from './style/Global'
import { store } from './store'
import { Provider } from 'react-redux'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { RECAPTCHA_SITE_KEY } from 'constants/env'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-modal'
import React from 'react'
import ReactDOM from 'react-dom'

Modal.setAppElement('#root')

ReactDOM.render(
  <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
    <GlobalStyle />
    <Provider store={store}>
      <App />
      <ToastContainer theme="colored" />
    </Provider>
  </GoogleReCaptchaProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
