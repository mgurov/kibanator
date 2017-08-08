import React, { Component } from 'react';
import './App.css';
import AddWatchContainer from './components/AddWatchContainer.js'
import WatchListContainer from './components/WatchListContainer.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <WatchListContainer />
        <AddWatchContainer/>
      </div>
    );
  }
}

export default App;
