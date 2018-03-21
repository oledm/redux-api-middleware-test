import Promise from 'promise-polyfill'
import 'isomorphic-fetch'
import React from 'react'
import { render } from 'react-dom'
import configureStore from 'store/configureStore'
import { Provider } from 'react-redux'
import App from 'components/App'

const store = configureStore()

const Component = ({ initialObject }) => (
  <Provider store={store}>
    <App />
  </Provider>
)

function init(config) {
  const { appId } = config
  const rootElement = document.getElementById(appId)
  if (rootElement) {
    render(<Component />, rootElement)
  }
}

window.app = {
  init,
}
