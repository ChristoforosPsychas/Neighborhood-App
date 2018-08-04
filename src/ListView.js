import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import './App.css';

class ListView extends Component {
  /* My state in the ListView component. It contains the query of the search, an array of my searched locations and
     an array of the hidden markers */
  state = {
    query: '',
    searchedLocations: this.props.locations,
    hideRestMarkers: this.props.markers,
  }

  /* Function that updates the query on change and calls the function that updates the locations */
  updateQuery = (query) => {

    this.setState({ query })

    this.updateLocations(query)

  }
  /* Function that updates the location based on the given query */
  updateLocations = (query) => {
    let searchedLocations
    let hideRestMarkers
    /* If there is a query */
    if (query) {
      /* Create a match variable with the expression of the query */
      const match =  new RegExp(escapeRegExp(query), 'i')
      /* Filter the locations with that match and store the results in the searchedLocations variable */
      searchedLocations = this.props.locations.filter(location =>
                match.test(location.title))
      /* For every searched location, check if the location's title matches every marker's title. If not, filter out those markers.
         The result in the hideRestMarkers variable is the hidden markers */
      hideRestMarkers = this.props.markers.filter(marker =>
                 searchedLocations.every(location => location.title !== marker.title))
      /* Make all markers visible */
      this.props.markers.map(marker => marker.setVisible(true))
      /* Make the hidden markers actually hidden */
      hideRestMarkers.map(marker => marker.setVisible(false))
      /* Update the state with the correct values */
      this.setState({searchedLocations, hideRestMarkers})
      /* Else if there is not a query (empty query) */
    } else {
        /* Make all markers visible and update the state */
        this.props.markers.forEach(marker => marker.setVisible(true))
        this.setState({searchedLocations: this.props.locations, hideRestMarkers: this.props.markers})
    }
  }
  /* Function when a li item is clicked.
     It maps over the markers and if there is a match, create an infowindow and make the marker bounce */
  listItemClicked = (location) => {
    let self = this

    this.props.markers.map(function(marker) {
      if (marker.title === location.title) {
        self.props.createInfoWindows(marker, self.props.infoWindow)
        self.props.bounce(marker)
      }
    })
  }

  render() {
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
          { /* Map over the searched locations and create for each, a list item */
            this.state.searchedLocations.map(location => (
              <li
                  className="li-item"
                  role="menuitem"
                  tabIndex={this.props.visibleList ? '0' : '-1'} /*Adjust the tabindex depending on whether the sidebar is visible or not*/
                  key={location.title}
                  onClick={() => this.listItemClicked(location)}
                  onKeyPress={() => this.listItemClicked(location)} /* For ARIA purposes. The user must be able to press a key
                                                                       to select a list item, not only click it. */
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
