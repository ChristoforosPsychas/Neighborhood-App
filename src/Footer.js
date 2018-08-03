import React, { Component } from 'react';

import './App.css';


class Footer extends Component {
  render() {
    return(
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
    )
  }
}

export default Footer
