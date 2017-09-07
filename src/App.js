import React from 'react';
import './App.css';
import AddWatchContainer from './components/AddWatchContainer.js'
import WatchListContainer from './components/WatchListContainer.js'
import DataListContainer from './components/datalist/DataListContainer.js'
import {ConfigContainer} from './components/config'
import Reset from './components/timerange/Reset'
import DocumentTitleContainer from './components/title/DocumentTitleContainer'

let App = () => {

  let showWatches = false

  let watches
  if (showWatches) {
    watches = (<div><WatchListContainer />
               <AddWatchContainer /></div>)
  }

  return (
    <div className="App">
      <DocumentTitleContainer />
      <div className="App-header">
        <ConfigContainer />&nbsp;<Reset />
      </div>
      {watches}
      <DataListContainer />
    </div>
  );
}

export default App;
