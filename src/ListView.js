import React, { Component } from 'react';



class ListView extends Component {

  state = {
    query: ''
  }

  updateQuery = (query) => {

    this.setState({ query })

    this.props.getSearchedLocations(query)

  }



  openInfo = (e) => {

   document.querySelector('#gmimap'+e.target.dataset.index).firstElementChild.click();

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
      {this.props.locations.map((location, index) =>
        <li
        /* There is an attribute that you can add on all DOM element, it's the `data-*`
        You can replace the `*` with anything you want that would be used as a label for the data you want to pass in this attribute
        In javascript, you can access the value you pass in using `element.dataset.*`
        MUST READ !! */

          data-index={index}
          onClick={this.openInfo}
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
