import React from 'react';
import './App.css';
import Reset from './components/timerange/Reset'
import DocumentTitleContainer from './components/title/DocumentTitleContainer'
import VersionWidget from './components/version/VersionWidget'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import CheckConfigPresent from './components/config/CheckConfigPresent';
import WatchList from './components/watch/WatchList';
import OnWatchSelected from './components/watch/OnWatchSelected'
import LandingWatch from './components/watch/LandingWatch';
import EditConfig from './components/watch/edit/EditConfig';

let App = () => {

  return (
    <Router basename="/ui">
      <div className="App">
        <DocumentTitleContainer />

        <div className="App-header">
          <Link to="/" data-test-id="home-page"><VersionWidget /></Link>{' '}
          <Reset />
        </div>

        <CheckConfigPresent />

        <Route path="/" exact component={WatchList} />

        <Switch>
          <Route path="/watch/new" component={EditConfig} />
          <Route path="/watch/:watchIndex" render={({match}) => <div>
              <OnWatchSelected watchIndex={match.params.watchIndex} />
              <LandingWatch watchIndex={match.params.watchIndex}/>
            </div>} />
        </Switch>


      

      </div>
    </Router>
  );
}

export default App;
