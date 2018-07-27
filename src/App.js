import React, { Component } from 'react';
import Mapping from './Mapping.js'
import ListView from './ListView.js'
import './App.css';

class App extends Component {
 state = {
   locations: [
     {title: 'Rion-Antirion Bridge', location: {lat: 38.320591, lng: 21.773711}},
     {title: 'Saint Andrew Cathedral Church', location: {lat:  38.242382, lng: 21.727836}},
     {title: 'Castle of Patras', location: {lat: 38.245297, lng: 21.743029}},
     {title: 'Panepistioupoli Patron', location: {lat: 38.28923, lng: 21.785369}},
     {title: 'Romaiko Odio Patras', location: {lat: 38.243329, lng: 21.738134}},
     {title: 'Archaeological Museum of Patras', location: {lat:  38.263523, lng: 21.752453}},
     {title: 'Dasyllio', location: {lat: 38.249149, lng: 21.743604}},
     {title: 'Square of King George', location: {lat: 38.246253, lng: 21.735066}},
     {title: 'Agios Vasileios', location: {lat: 38.313004, lng: 21.817007}}
   ],
   markers: []
 }

  handleClick = (e) => {

  }

  createInfoWindows = (marker, infowindow, map) => {
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });
    }
  }



  render() {
    return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">
              Mission Possible: Visiting Patra
            </h1>
          </header>

       <Mapping
          locations = {this.state.locations}
          markers = {this.state.markers}
          createInfoWindows = {this.createInfoWindows}
       />
       <ListView
          locations = {this.state.locations}
          createInfoWindows = {this.createInfoWindows}
       />
        </div>
    )
  }
}

export default App
