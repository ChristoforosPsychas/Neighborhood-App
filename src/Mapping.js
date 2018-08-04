import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader'
import './App.css';


class Mapping extends Component {

  state = {
    /* Simple boolean variable when the map fails to load */
    loadMapFailed: false
  }
  /* Idea taken from here: https://stackoverflow.com/questions/41709765/how-to-load-the-google-maps-api-script-in-my-react-app-only-when-it-is-require */
  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
  if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
    if (isScriptLoadSucceed) {
      this.props.initMap()
    }
    else {
      /* If the map fails, make the variable true */
      this.setState(() => ({
           loadMapFailed: true
         })
       )
    }
   }
  }


  render() {
    return(
      <div id="map-container">
        <div id="map" role="application">
          {this.state.loadMapFailed === true && ( /* Make the custom p tag appears in the place of the map */

              <p id="error">
                The map did not load successfully.<br/>
                Please come later.
              </p>

          )}
        </div>
      </div>
    )
  }
}
/* We use the scriptloader from the react-async-sciptloader package */
export default scriptLoader (
  ["https://maps.googleapis.com/maps/api/js?key=AIzaSyCtHhaVCdZU5d8QduMfcHZE1P-cHYnpoRg"]
)(Mapping)
