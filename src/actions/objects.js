import { getJSON } from 'redux-api-middleware'
import { callApi } from 'api'
import * as actionTypes from './types'

export const loadObjects = () => (dispatch, getState) => {
  return dispatch(callApi({
    endpoint: 'https://api.github.com/users/oledm',
    types: [
      actionTypes.REQUEST_LOAD_OBJECTS,
      actionTypes.SUCCESS_LOAD_OBJECTS,
      actionTypes.FAILURE_LOAD_OBJECTS,
    ],
  }))
}
