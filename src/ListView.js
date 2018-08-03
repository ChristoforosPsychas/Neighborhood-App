import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import './App.css';

class ListView extends Component {

  state = {
    query: '',
    searchedLocations: this.props.locations,
    hideRestMarkers: this.props.markers,
  }

  updateQuery = (query) => {

    this.setState({ query })

    this.updateLocations(query)

  }

  updateLocations = (query) => {
    let searchedLocations
    let hideRestMarkers

    if (query) {
      const match =  new RegExp(escapeRegExp(query), 'i')
      //console.log(match)

      searchedLocations = this.props.locations.filter(location =>
                match.test(location.title))

    //  console.log(searchedLocations)

       hideRestMarkers = this.props.markers.filter(marker =>
                 searchedLocations.every(location => location.title !== marker.title))

   //console.log(hideRestMarkers)

       this.props.markers.map(marker => marker.setVisible(true))

    //console.log(this.props.markers)

       hideRestMarkers.map(marker => marker.setVisible(false))
        this.setState({searchedLocations, hideRestMarkers})

      // setTimeout(() => {
      //   console.log(this.state.searchedLocations)
      //   console.log(this.state.hideRestMarkers)
      // }, 1)

    } else {
      this.props.markers.forEach(marker => marker.setVisible(true))
      this.setState({searchedLocations: this.props.locations, hideRestMarkers: this.props.markers})

      // setTimeout(() => {
      //   console.log(this.state.searchedLocations)
      //   console.log(this.state.hideRestMarkers)
      // }, 1)
    }

  }

  listItemClicked = (location) => {
    // e.preventDefault()
    // index = e.target.dataset.index
    let self = this

    //this.props.markers.map(marker => marker.title === location.title && this.props.createInfoWindows(marker))
    this.props.markers.map(function(marker) {
      if (marker.title === location.title) {
        self.props.createInfoWindows(marker, self.props.infoWindow)
        self.props.bounce(marker)
      }
    })
    //this.props.createInfoWindows(this.props.markers[index],this.props.infoWindow,this.props.map)
    //this.props.bounce(location.title)

    //this.setState({ currentMarker })
  }

  // openInfo = (e) => {
  // document.addEventListener("DOMContentLoaded", function() {
  //  document.querySelector('#gmimap'+e.target.dataset.index).firstElementChild.click();
  //   })
  // }

  render() {

    /****************************************************************************************************************************
    *There is an attribute that you can add on all DOM element, it's the `data-*`                                               *
    *You can replace the `*` with anything you want that would be used as a label for the data you want to pass in this attribute*
    *In javascript, you can access the value you pass in using `element.dataset.*`                                              *
    *********************************************************  MUST READ !! ****************************************************/

    return(
      <nav id='side-bar'>
        <form>
          <div id="input-filter" aria-label="Input">
            <input
              className="input-box"
              aria-labelledby="input-filter"
              type='text'
              placeholder='Enter map sight...'
              value={this.state.query}
              onChange={(event) => this.updateQuery(event.target.value)}
            />
          </div>
        </form>
        <ul className="li-list" aria-label="List of locations" role="menubar">
          {
            this.state.searchedLocations.map(location => (
              <li
                  className="li-item"
                  role="menuitem"
                  tabIndex={this.props.visibleList ? '0' : '-1'}
                  key={location.title}
                  onClick={() => this.listItemClicked(location)}
                  onKeyPress={() => this.listItemClicked(location)}
              >
                  {location.title}
              </li>
              ))
          }
        </ul>
      </nav>
    )
  }
}

export default ListView
