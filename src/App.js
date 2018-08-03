import React, { Component } from 'react';
import Mapping from './Mapping.js'
import ListView from './ListView.js'
import fetchJsonp from 'fetch-jsonp';
import scriptLoader from 'react-async-script-loader'
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
   this.setState({ map })
   this.createMarkers(map)
 }


 createMarkers = (map) => {
   //let infoWindow = new window.google.maps.InfoWindow();
   const markers = this.state.markers.slice()
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
         this.createInfoWindows(marker)
         this.bounce(marker)
     })

   })
   map.fitBounds(bounds)
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
          let infoWindow = new window.google.maps.InfoWindow({
            map: this.state.map,
            title: marker.title,
            maxWidth: 350,
            content: this.state.content
          })

          this.setState({ infoWindow })

          if (window.screen.width >= 360 && window.screen.width < 500) {
            infoWindow.maxWidth = 110
          } else if (window.screen.width >= 500 && window.screen.width < 651) {
            infoWindow.maxWidth = 200
          }

          this.state.infoWindow.open(this.state.map, marker);

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
          <header className="App-header">
            <div className="icon-title-container" aria-label="Icon & Title">
              <div className="button" aria-label="Button Container">
                <button className="button-icon" aria-label="Toggle Location List">
                  <img alt="Hamburger icon" src="https://i.imgur.com/YSPIKhL.png" />
                </button>
              </div>
              <h1 className="App-title">
                Mission Possible: Visiting Patra
              </h1>
            </div>
          </header>
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
            />
          </main>
          <footer className="footer">
            <p className="app-attribution" aria-label="Attribution">
                This Neighborhood App was developed by Christoforos Psychas.<br/>
                Dependencies used are the following:<br/>
                Wikipedia API<br/>
                Google Maps API<br/>
                Icons made by Flaticon
            </p>
            <p className="icons-attribution" aria-label="Attribution">
              Icons made by <a href="https://www.flaticon.com/authors/eleonor-wang" title="Eleonor Wang">Eleonor Wang</a>
              from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
              is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
            </p>
          </footer>
        </div>
    )
  }
}

export default App
