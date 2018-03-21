import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadObjects } from 'actions/objects'

class App extends React.PureComponent {
  componentDidMount() {
    this.props
      .loadObjects()
      .then((data) => {
        console.log('Data from action:', data)
      })
      .catch((error) => {
        console.warn('Error:', error)
      })
  }

  render() {
    const { item } = this.props
    console.log('item', item)
    return <div>App</div>
  }
}

export default connect(
  state => ({
    item: state.objects.item,
  }),
  {
    loadObjects,
  }
)(App)
