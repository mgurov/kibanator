import React from 'react';
import './App.css';
import Reset from './components/timerange/Reset';
import DocumentTitleContainer from './components/title/DocumentTitleContainer';
import VersionWidget from './components/version/VersionWidget';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import CheckConfigPresent from './components/config/CheckConfigPresent';
import WatchList from './components/watch/WatchList';
import LandingWatch from './components/watch/LandingWatch';
import EditConfig from './components/watch/edit/EditConfig';

import { library } from '@fortawesome/fontawesome-svg-core'
import * as awesomeIcons from '@fortawesome/free-solid-svg-icons'


let App = () => {

  library.add(
    awesomeIcons.faSync, 
    awesomeIcons.faChevronDown, 
    awesomeIcons.faChevronRight, 
    awesomeIcons.faCheckCircle, 
    awesomeIcons.faCheckDouble, 
    awesomeIcons.faCopy, 
    awesomeIcons.faFilter,
    awesomeIcons.faWrench,
    awesomeIcons.faTrashAlt,
    awesomeIcons.faBook,
  )

  return (
    <Router basename="/ui">
      <div className="App">
        <div className="App-header">
          <Link to="/" data-test-id="home-page"><VersionWidget /></Link>{' '}
          <Reset />
        </div>

        <CheckConfigPresent />

        <Route path="/" exact component={WatchList} />

        <Switch>
          <Route path="/watch/new" component={EditConfig} />
          <Route path="/watch/:watchIndex" render={({match}) => <div>
              <LandingWatch watchIndex={match.params.watchIndex}/>
            </div>} />
        </Switch>

        <Switch>
          <Route path="/(watch)?/:watchIndex?" render={({match}) =>
              <DocumentTitleContainer watchIndex={match.params.watchIndex} />
            } />
        </Switch>

      </div>
    </Router>
  );
}

export default App;
