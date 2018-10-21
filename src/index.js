import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import App from './App';
import {unregister} from './registerServiceWorker';
import { Provider } from 'react-redux';
import 'react-app-polyfill/ie11'; //need this for cypress fetch hack

import {newStore} from './store'

let store = newStore()

ReactDOM.render(<Provider store={store}>
    <App/>
  </Provider>, document.getElementById('root'));
unregister();
