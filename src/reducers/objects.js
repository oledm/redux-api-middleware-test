import * as ActionTypes from 'actions/types'

const initialState = {
  isFetching: false,
  item: null,
  isError: false,
  error: null,
}

export default function objectsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case ActionTypes.REQUEST_LOAD_OBJECTS:
      return Object.assign({}, state, {
        isFetching: true,
      })

    case ActionTypes.SUCCESS_LOAD_OBJECTS:
      return Object.assign({}, state, {
        item: payload,
        isError: false,
        isFetching: false,
        error: null,
      })

    case ActionTypes.FAILURE_LOAD_OBJECTS:
      return Object.assign({}, state, {
        item: null,
        isError: true,
        isFetching: false,
        error: payload,
      })

    default:
      return state
  }
}
