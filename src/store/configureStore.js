import { createStore, applyMiddleware, compose } from 'redux'
import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'
import rootReducer from 'reducers/root'

const configureStore = (preloadedState = {}) => {
  return createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(thunk, apiMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )
}

export default configureStore
