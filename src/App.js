import React, { Component } from 'react';
import Mapping from './Mapping.js'
import ListView from './ListView.js'
import Header from './Header.js'
import Footer from './Footer.js'
import fetchJsonp from 'fetch-jsonp';

import './App.css';

class App extends Component {
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
   isOpen: false,
   infoWindow: ''
 }

 componentDidMount() {
   const button = document.querySelector(".button-icon");
   button.addEventListener('click', this.showMenu);

   window.gm_authFailure = this.gm_authFailure
 }


 gm_authFailure = () => {

   alert('Loading map failed. Authentication incorrect. Please try again.')

 }


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


 createMarkers = (map, infoWindow) => {
   //let infoWindow = new window.google.maps.InfoWindow();
   const markers = this.state.markers.slice()
   //const infoWindows = this.state.infoWindows.slice()
   const bounds = new window.google.maps.LatLngBounds();

   this.state.locations.map(location => {
     let marker = new window.google.maps.Marker({
       map: map,
       position: location.location,
       title: location.title,
       animation: window.google.maps.Animation.DROP,
       id: location.title
     });
     markers.push(marker)
     bounds.extend(marker.position)

     this.setState({ markers })

     marker.addListener('click',  () => {
         //infoWindows.map(infoWindow => infoWindow.setMarker = null)
         if (infoWindow) infoWindow.close()
         this.createInfoWindows(marker, infoWindow)
         this.bounce(marker)

     })
    //this.setState({ infoWindows })
     // console.log(infoWindows)

   })
   map.fitBounds(bounds)
 }

 createInfoWindows = (marker, infoWindow) => {
   let location = marker.title
   //const infoWindows = this.state.infoWindows.slice()


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
     /*********************WIKIPEDIA API*********************************/
     /*** Wikipedia API was implemented with the help of the above links and with the following video: *******/
     /*** https://www.youtube.com/watch?v=RPz75gcHj18&t=1221s ****/

     fetchJsonp(searchUrl)
        .then((response) => {

          return response.json()

        }).then((data) => {

          let pages = data.query.pages
          let pageId = Object.keys(data.query.pages)[0]
          let content = pages[pageId].extract

          if (!content) content = 'No Information Available'

          this.setState({content});

        }).catch((err) => {

          let pageFailed = 'Request failed: ' + err;

          this.setState({content: pageFailed});

        }).then(() => {
          // let infoWindow = new window.google.maps.InfoWindow({
          //   map: this.state.map,
          //   title: marker.title,
          //   maxWidth: 350,
          //   content: this.state.content
          // })
          //infoWindows.push(infoWindow)
          //console.log(infoWindows)
          infoWindow.setContent(this.state.content)

        //  this.setState({ infoWindows })

          if (window.screen.width >= 360 && window.screen.width < 500) {
              infoWindow.maxWidth = 110
          } else if (window.screen.width >= 500 && window.screen.width < 651) {
              infoWindow.maxWidth = 200
          }

              infoWindow.open(this.state.map, marker);

        })

            //const infowindow = this.state.infoWindow.slice()

          //  console.log(infoWindow)
            //infoWindow.marker = marker;


            // infowindow.addListener('closeclick',function(){
            //     infowindow.setMarker = null;
            //   });

            //this.state.infoWindow.close()

    /********************************************************/
   //infoWindow = new window.google.maps.InfoWindow({  })


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
