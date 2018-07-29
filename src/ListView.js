import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'


class ListView extends Component {

  state = {
    query: ''
  }

  updateQuery = (query) => {

    this.setState({ query })

  }



  openInfo = (e) => {

   document.querySelector('#gmimap'+e.target.dataset.index).firstElementChild.click();

 }

  render() {
    const match =  new RegExp(escapeRegExp(this.state.query), 'i')

    /****************************************************************************************************************************
    *There is an attribute that you can add on all DOM element, it's the `data-*`                                               *
    *You can replace the `*` with anything you want that would be used as a label for the data you want to pass in this attribute*
    *In javascript, you can access the value you pass in using `element.dataset.*`                                              *
    *********************************************************  MUST READ !! ****************************************************/


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
      {
        this.props.locations.filter((location, index) => {
          this.props.markers.filter(marker => {
           match.test(location.title).filter(marker => {
             //https://stackoverflow.com/questions/5030127/marker-visibility-in-google-maps
             marker.title !== location.title
             marker.setVisible(false)
           }

         )})

       return(
            <li
              data-index={index}
              onClick={this.openInfo}
            >
              {location.title}
            </li>
          )
      })
    }
      </ul>
      </div>
      /*this.props.locations.map((location, index) => {
        match.test(location.title) && (
        this.props.markers.filter(marker => (
          marker.title === location.title ?
          marker.setMap(this.props.map) : marker.setMap(null)
        )))*/

    )
  }
}

export default ListView
