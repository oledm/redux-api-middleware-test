import * as ActionTypes from 'actions/types'

const initialState = {
  isFetching: false,
  item: [],
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
        isFetching: false,
      })

    case ActionTypes.FAILURE_LOAD_OBJECTS:
      return Object.assign({}, state, {
        isFetching: false,
        error: payload,
      })

    default:
      return state
  }
}
