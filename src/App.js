import React from 'react';
import './App.css';
import HitsTimeline from './components/datalist/HitsTimeline'
import {ConfigContainer} from './components/config'
import Reset from './components/timerange/Reset'
import DocumentTitleContainer from './components/title/DocumentTitleContainer'
import VersionWidget from './components/version/VersionWidget'
import TimeRangeControl from './components/timerange/TimeRangeControl'

let App = () => {

  return (
    <div className="App">
      <DocumentTitleContainer />
      <div className="App-header">
        <VersionWidget/> &nbsp; <ConfigContainer />&nbsp;<Reset />&nbsp;<TimeRangeControl/>
      </div>
      <HitsTimeline />
    </div>
  );
}

export default App;
