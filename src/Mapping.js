import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader'

import './App.css';

class Mapping extends Component {

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
  if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
    if (isScriptLoadSucceed) {
      this.initMap()
    }
    else this.props.onError()
  }
}

  initMap = () => {
    //https://stackoverflow.com/questions/43714895/google-is-not-defined-in-react-app-using-create-react-app
    //window was required for this to work.
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.24664, lng: 21.734574},
      zoom: 12
    });

    this.props.createMarkers(map)
  }

  render() {
    return(
      <div className="map-container">
        <div id="map">

        </div>
      </div>

    )
  }
}

export default scriptLoader (
  ["https://maps.googleapis.com/maps/api/js?key=AIzaSyAZi1ZJwzOn-3UOAM8fJ2yiQ4BMt7-Ge20"]
)(Mapping)
