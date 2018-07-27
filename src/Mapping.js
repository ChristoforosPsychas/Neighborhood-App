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

    this.createMarkers(map)
  }

  createMarkers = (map) => {
    let infoWindow = new window.google.maps.InfoWindow();

    this.props.locations.map(location => {
      let marker = new window.google.maps.Marker({
        map: map,
        position: location.location,
        title: location.title,
        animation: window.google.maps.Animation.DROP,
        id: location.title
      });
      this.props.markers.push(marker)

      marker.addListener('click',  () => {
          this.props.createInfoWindows(marker, infoWindow, map)
          this.bounce(marker)
      })
    })
  }

  bounce = (marker) => {
    marker.setAnimation(window.google.maps.Animation.BOUNCE)
    setTimeout(() => {
      marker.setAnimation(null)
    }, 1500)

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
