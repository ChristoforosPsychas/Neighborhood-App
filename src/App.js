import React, { Component } from 'react';
import Mapping from './Mapping.js'
import ListView from './ListView.js'
import Header from './Header.js'
import Footer from './Footer.js'
import fetchJsonp from 'fetch-jsonp';

import './App.css';

class App extends Component {
 /* My state. It holds an array of my locations, an array of markers, my map, my infowindow's content,
    a boolean for the visibility of the list and my infowindow */
 state = {
   locations: [
     {title: 'Rio–Antirrio bridge', location: {lat: 38.320591, lng: 21.773711}},
     {title: "St Andrew's Cathedral, Patras", location: {lat:  38.242382, lng: 21.727836}},
     {title: 'Patras Castle', location: {lat: 38.245297, lng: 21.743029}},
     {title: 'Apollon Theatre (Patras)', location: {lat: 38.246472, lng: 21.735329}},
     {title: 'Achaia Clauss', location: {lat: 38.196911, lng: 21.769676}},
     {title: 'Archaeological Museum of Patras', location: {lat:  38.263523, lng: 21.752453}},
     {title: 'Patras Lighthouse', location: {lat: 38.245078, lng: 21.72559}},
     {title: 'Georgiou I Square', location: {lat: 38.246253, lng: 21.735066}},
     {title: 'Panepistioupoli Patron', location: {lat: 38.28923, lng: 21.785369}},
     {title: 'Romaiko Odio Patras', location: {lat: 38.243329, lng: 21.738134}},
     {title: 'Dasyllio Patras', location: {lat: 38.249149, lng: 21.743604}}
   ],
   markers: [],
   map: '',
   content: '',
   visibleList: true,
   infoWindow: ''
 }

 componentDidMount() {
   /* Adding a listener to my button which it will show or hide the locations list  */
   const button = document.querySelector(".button-icon");
   button.addEventListener('click', this.showMenu);

   window.gm_authFailure = this.gm_authFailure
 }


 /* Google Maps function for authentication errors */
 gm_authFailure = () => {

   alert('Loading map failed. Authentication incorrect. Please try again.')

 }

 /* Function for the listener for the button.
 I find the elements in the DOM, and toggle some classes to hide or show the locations list
 Lastly, i create a hide boolean variable to check if my nav element contains the hide class
 This is done for ARIA purposes for the tabindex *Check ListView file->render->li*  */
 showMenu = () => {
   const nav = document.querySelector("#side-bar");
   const mapContainer = document.querySelector("#map-container");
   nav.classList.toggle("hide");
   mapContainer.classList.toggle("grow");

   let hide = nav.classList.contains("hide")

   if (hide) {
     this.setState({ visibleList: false})
   } else {
     this.setState({ visibleList: true})
   }
 }

 /* Initialise Google Maps, giving a center and showing the city of Patras, Greece  */
 initMap = () => {
   //https://stackoverflow.com/questions/43714895/google-is-not-defined-in-react-app-using-create-react-app
   //window was required for this to work.
   const map = new window.google.maps.Map(document.getElementById('map'), {
     center: {lat: 38.24664, lng: 21.734574},
     zoom: 12
   });

   let infoWindow = new window.google.maps.InfoWindow({
     map: map,
     maxWidth: 350
   })

   this.setState({ map, infoWindow })
   this.createMarkers(map, infoWindow)
 }

 /* Creation of my markers */
 createMarkers = (map, infoWindow) => {
   const markers = this.state.markers.slice()
   const bounds = new window.google.maps.LatLngBounds();

   /* Map through all locations and create each marker */
   this.state.locations.map(location => {
     let marker = new window.google.maps.Marker({
       map: map,
       position: location.location,
       title: location.title,
       animation: window.google.maps.Animation.DROP,
       id: location.title
     });
     /* Push each marker into an array of markers */
     markers.push(marker)
     bounds.extend(marker.position)

     this.setState({ markers })
     /* Create a listener for each marker on click*/
     marker.addListener('click',  () => {
         if (infoWindow) infoWindow.close()
         this.createInfoWindows(marker, infoWindow)
         this.bounce(marker)

     })
   })
   map.fitBounds(bounds)
 }
 /* Creation of the infowindows */
 createInfoWindows = (marker, infoWindow) => {
   let location = marker.title
   let searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=' + location
   searchUrl = searchUrl.replace(/ /g, '%20');

     /***********************************Sources with information about WIKIPEDIA API**********************************************

     https://stackoverflow.com/questions/8555320/is-there-a-clean-wikipedia-api-just-for-retrieve-content-summary
     https://stackoverflow.com/questions/7185288/how-to-get-wikipedia-content-using-wikipedias-api
     https://en.wikipedia.org/wiki/Special:ApiSandbox#action=query&format=json&prop=extracts&titles=Athens&exintro=1&explaintext=1
     https://stackoverflow.com/questions/35760164/get-random-wikipedia-extract-with-ajax
     https://www.mediawiki.org/wiki/API:Main_page
     https://www.mediawiki.org/w/api.php?action=help&modules=query%2Bextracts

     Fetch doesnt support jsonp. After trial and error and much searching, i found a package with a special fetch, fetchJsonp.
     Package fetch JSONP: https://www.npmjs.com/package/fetch-jsonp

     *****************************************************************************************************************************/

     /*********************WIKIPEDIA API*********************************/
     /*** Wikipedia API was implemented with the help of the above links and with the following video: ***/
     /*** https://www.youtube.com/watch?v=RPz75gcHj18&t=1221s ***/

     /* Fetching from the API of WIKIPEDIA */
     fetchJsonp(searchUrl)
        .then((response) => {

          return response.json()

        }).then((data) => {
          /* Retrieve content from the above response as per shown in the video */
          let pages = data.query.pages
          let pageId = Object.keys(data.query.pages)[0]
          let content = pages[pageId].extract
          /* If the page of wikipedia doesnt contain data of the place, set content the following message */
          if (!content) content = 'No Information Available'

          this.setState({content});

        }).catch((err) => {

          let pageFailed = 'Request failed: ' + err

          this.setState({content: pageFailed});
          /* After i store the content into the state, i set the content of my infowindow to that value */
        }).then(() => {

          infoWindow.setContent(this.state.content)
          /* If - else statement to adjust the infowindow's maxwidth depending on the view port */
          if (window.screen.width >= 360 && window.screen.width < 500) {
              infoWindow.maxWidth = 110
          } else if (window.screen.width >= 500 && window.screen.width < 651) {
              infoWindow.maxWidth = 200
          }
          /* Finally i open the infowindow with the map and the marker */
          infoWindow.open(this.state.map, marker);

        })
 }

 /* Simple function for the bounce. When the marker is clicked, i set the Animation of the marker to bounce for some time */
 bounce = (marker) => {
   marker.setAnimation(window.google.maps.Animation.BOUNCE)
   setTimeout(() => {
     marker.setAnimation(null)
   }, 1500)
 }

  render() {
    return (
        <div className="App">
          <Header />
          <main className="main-content" role="main">
            <Mapping
              initMap = {this.initMap}
            />
            <ListView
              locations = {this.state.locations}
              markers = {this.state.markers}
              createInfoWindows = {this.createInfoWindows}
              bounce = {this.bounce}
              visibleList = {this.state.visibleList}
              infoWindow = {this.state.infoWindow}
            />
          </main>
          <Footer />
        </div>
    )
  }
}

export default App
