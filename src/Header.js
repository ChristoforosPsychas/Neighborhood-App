import React, { Component } from 'react';

import './App.css';


class Header extends Component {
  render() {
    return(
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
    )
  }
}

export default Header
