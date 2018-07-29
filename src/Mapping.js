import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader'

import './App.css';

class Mapping extends Component {

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
  if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
    if (isScriptLoadSucceed) {
      this.props.initMap()
    }
    else this.props.onError()
  }
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
