import React from 'react';
import './App.css';
import AddWatchContainer from './components/AddWatchContainer.js'
import WatchListContainer from './components/WatchListContainer.js'
import DataListContainer from './components/datalist/DataListContainer.js'
import {ConfigContainer} from './components/config'

let App = () => {

  let showWatches = false

  let watches
  if (showWatches) {
    watches = (<div><WatchListContainer />
               <AddWatchContainer /></div>)
  }

  return (
    <div className="App">
      <div className="App-header">
        <h2>Kibanator <ConfigContainer /></h2>
      </div>
      {watches}
      <DataListContainer />
    </div>
  );
}

export default App;
