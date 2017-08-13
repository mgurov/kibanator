import React from 'react';
import './App.css';
import AddWatchContainer from './components/AddWatchContainer.js'
import WatchListContainer from './components/WatchListContainer.js'
import DataListContainer from './components/DataListContainer.js'

let App = () => {
  return (
    <div className="App">
      <div className="App-header">
        <h2>Welcome to React</h2>
      </div>
      <WatchListContainer />
      <AddWatchContainer />
      <DataListContainer />
    </div>
  );
}

export default App;
