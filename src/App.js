import React from 'react';
import './App.css';
import AddWatchContainer from './components/AddWatchContainer.js'
import WatchListContainer from './components/WatchListContainer.js'
import HitsTimeline from './components/datalist/HitsTimeline'
import {ConfigContainer} from './components/config'
import Reset from './components/timerange/Reset'
import DocumentTitleContainer from './components/title/DocumentTitleContainer'
import VersionWidget from './components/version/VersionWidget'
import TimeRangeControl from './components/timerange/TimeRangeControl'

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
        <VersionWidget/> &nbsp; <ConfigContainer />&nbsp;<Reset />&nbsp;<TimeRangeControl/>
      </div>
      {watches}
      <HitsTimeline />
    </div>
  );
}

export default App;
