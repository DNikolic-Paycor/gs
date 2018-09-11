import React, { Component } from 'react';
import Header from './header/Header'
import Search from './search/Search'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header/>
        <Search/>
      </div>
    );
  }
}

export default App;
