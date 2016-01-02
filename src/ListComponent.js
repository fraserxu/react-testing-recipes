import React, { PropTypes } from 'react'

class ListComponent extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { user, handleMouseDown } = this.props
    return (
      <li onMouseDown={handleMouseDown}>{user.name}</li>
    )
  }
}

ListComponent.propTypes = {
  user: PropTypes.object.isRequired,
  handleMouseDown: PropTypes.func.isRequired
}

export default ListComponent
