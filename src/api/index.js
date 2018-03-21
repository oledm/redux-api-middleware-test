import { CALL_API } from 'redux-api-middleware'

export const REQUEST = 'REQUEST'
export const SUCCESS = 'SUCCESS'
export const FAILURE = 'FAILURE'

export const callApi = ({
  types,
  endpoint,
  method = 'GET',
  headers,
  data,
  credentials = 'omit',
}) => {
  console.log(`calling ${method} on API endpoint ${endpoint}`)

  return {
    [CALL_API]: {
      endpoint,
      headers: (state) => {
        return {
          'Content-type': 'application/json',
          ...headers,
        }
      },
      method,
      credentials,
      body: method !== 'GET' ? JSON.stringify(data) : null,
      types: [
        (types && types[0]) || REQUEST,
        (types && types[1]) || SUCCESS,
        (types && types[2]) || {
          type: FAILURE,
          meta: (action, state, res) => {
            if (res && !res.ok) {
              return {
                failedAction: action,
              }
            }
          },
        },
      ],
    },
  }
}
