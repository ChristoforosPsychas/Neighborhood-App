import React, { Component } from 'react';
import Mapping from './Mapping.js'
import ListView from './ListView.js'
import fetchJsonp from 'fetch-jsonp';
import './App.css';

class App extends Component {
 state = {
   locations: [
     {title: 'Rio–Antirrio bridge', location: {lat: 38.320591, lng: 21.773711}},
     {title: 'Saint Andrew Cathedral Church', location: {lat:  38.242382, lng: 21.727836}},
     {title: 'Castle of Patras', location: {lat: 38.245297, lng: 21.743029}},
     {title: 'Panepistioupoli Patron', location: {lat: 38.28923, lng: 21.785369}},
     {title: 'Romaiko Odio Patras', location: {lat: 38.243329, lng: 21.738134}},
     {title: 'Archaeological Museum of Patras', location: {lat:  38.263523, lng: 21.752453}},
     {title: 'Dasyllio', location: {lat: 38.249149, lng: 21.743604}},
     {title: 'Square of King George', location: {lat: 38.246253, lng: 21.735066}},
     {title: 'Agios Vasileios', location: {lat: 38.313004, lng: 21.817007}}
   ],
   markers: [],
   map: '',
   infoWindow: '',
   content: ''
 }

 initMap = () => {
   //https://stackoverflow.com/questions/43714895/google-is-not-defined-in-react-app-using-create-react-app
   //window was required for this to work.
   const map = new window.google.maps.Map(document.getElementById('map'), {
     center: {lat: 38.24664, lng: 21.734574},
     zoom: 12
   });
   this.setState({ map })
   this.createMarkers(map)
 }


 createMarkers = (map) => {
   //let infoWindow = new window.google.maps.InfoWindow();
   const markers = this.state.markers.slice()

   this.state.locations.map(location => {
     let marker = new window.google.maps.Marker({
       map: map,
       position: location.location,
       title: location.title,
       animation: window.google.maps.Animation.DROP,
       id: location.title
     });
     markers.push(marker)

     this.setState({ markers })

     marker.addListener('click',  () => {
         this.createInfoWindows(marker)
         this.bounce(marker)
     })

   })

 }

 createInfoWindows = (marker) => {
   let location = marker.title

   let searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=' + location
   searchUrl = searchUrl.replace(/ /g, '%20');

     console.log(searchUrl)
     /*****Sources with information about WIKIPEDIA API***********************

     https://stackoverflow.com/questions/8555320/is-there-a-clean-wikipedia-api-just-for-retrieve-content-summary
     https://stackoverflow.com/questions/7185288/how-to-get-wikipedia-content-using-wikipedias-api
     https://en.wikipedia.org/wiki/Special:ApiSandbox#action=query&format=json&prop=extracts&titles=Athens&exintro=1&explaintext=1
     https://stackoverflow.com/questions/35760164/get-random-wikipedia-extract-with-ajax
     https://www.mediawiki.org/wiki/API:Main_page
     https://www.mediawiki.org/w/api.php?action=help&modules=query%2Bextracts
     Package fetch JSONP: https://www.npmjs.com/package/fetch-jsonp
     
     ****************************************************************************/
     fetchJsonp(searchUrl)
        .then((response) => {
          return response.json()
        }).then((data) => {

          let pages = data.query.pages
          let pageId = Object.keys(data.query.pages)[0]
          let content = pages[pageId].extract
          console.log(content)

          this.setState({content});

        }).catch((err) => {
          let pageFailed = 'Parsing failed: ' + err;
          this.setState({content: pageFailed});
        })

   //infoWindow = new window.google.maps.InfoWindow({  })

   let infoWindow = new window.google.maps.InfoWindow({
     map: this.state.map,
     title: marker.title,
     maxWidth: 200,
     content: this.state.content
   })

   this.setState({ infoWindow })

   setTimeout(() => {
      console.log(this.state.infoWindow)
    }, 1)

   infoWindow.open(this.state.map, marker);



   // if (infowindow.marker != marker) {
   //   infowindow.marker = marker;
   //   infowindow.setContent('<div>' + marker.title + '</div>');
   //   infowindow.open(map, marker);
   //   // Make sure the marker property is cleared if the infowindow is closed.
   //   infowindow.addListener('closeclick',function(){
   //     infowindow.setMarker = null;
   //   });
   // }
 }

 bounce = (marker) => {
   marker.setAnimation(window.google.maps.Animation.BOUNCE)
   setTimeout(() => {
     marker.setAnimation(null)
   }, 1500)
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
          initMap = {this.initMap}
       />
       <ListView
          locations = {this.state.locations}
          markers = {this.state.markers}
          map = {this.state.map}
          infoWindow = {this.state.infoWindow}
          createInfoWindows = {this.createInfoWindows}
          bounce = {this.bounce}
       />
        </div>
    )
  }
}

export default App
