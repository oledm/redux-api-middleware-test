import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadObjects } from 'actions/objects'

class App extends React.PureComponent {
  callApi = (url) => {
    const { loadObjects } = this.props
    loadObjects(url)
      .then((data) => {
        if (data.error) {
          console.warn('Error:', data)
        } else {
          console.log('Data fetched:', data)
        }
      })
      .catch((error) => {
        console.warn('Request failed:', error)
      })
  }

  callSucces = () => this.callApi('https://api.github.com/users/oledm')

  callFailed = () => this.callApi('https://api.github.com/XXXXX/oledm')

  render() {
    const { item, error } = this.props
    return (
      <div>
        <div>
          <button onClick={this.callSucces}>Call API success</button>
          <button onClick={this.callFailed}>Call API failure</button>
        </div>
        {item && item.avatar_url && <img src={item.avatar_url} alt="" />}
        {error && <div>Error: {error.message}</div>}
      </div>
    )
  }
}

export default connect(
  state => ({
    item: state.objects.item,
    error: state.objects.error,
  }),
  {
    loadObjects,
  }
)(App)
