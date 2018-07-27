import React, { Component } from 'react';

class ListView extends Component {

  state = {
    query: '',
    searchedLocations: []
  }

  updateQuery = (query) => {

    this.setState({ query })
  }


  render() {
    return(
      <div id='side-bar'>
        <input
          id='input-box'
          type='text'
          placeholder='Enter main sight'
          value={this.state.query}
          onChange={(event) => this.updateQuery(event.target.value)}
      />
      <ul>
      {this.props.locations.map(location =>
        <li
          onClick={() => this.props.createInfoWindows}
        >
        {location.title}
        </li>
      )}
      </ul>
      </div>

    )
  }
}

export default ListView
