import { callApi } from 'api'
import * as actionTypes from './types'

export const loadObjects = (endpoint) => {
  return callApi({
    endpoint,
    types: [
      actionTypes.REQUEST_LOAD_OBJECTS,
      actionTypes.SUCCESS_LOAD_OBJECTS,
      actionTypes.FAILURE_LOAD_OBJECTS,
    ],
  })
}
