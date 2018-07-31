import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'


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

    this.props.markers.map(marker => marker.title === location.title && this.props.createInfoWindows(marker))

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
        // this.props.locations.map((location, index) => {
        //   this.props.markers.filter(marker => {
        //    match.test(location.title).filter(marker => {
        //      //https://stackoverflow.com/questions/5030127/marker-visibility-in-google-maps
        //      marker.title !== location.title
        //      marker.setVisible(false)
        //    }
        //
        //  )})
        this.state.searchedLocations.map((location, index) => (
          <li
              key={location.title}
              data-index={index}
              onClick={() => this.listItemClicked(location)}
          >
              {location.title}
          </li>
        ))

        // this.props.markers.filter(marker => this.props.locations.map((location, index) =>
        //  match.test(location.title)
        //
        //  .filter(location =>
        // location.title !== marker.title && (
        //     <li
        //       data-index={index}
        //       onClick={this.openInfo}
        //     >
        //       {location.title}
        //     </li>)
        //   ))
        // )

      //})
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
