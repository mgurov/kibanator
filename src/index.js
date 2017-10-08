import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import App from './App';
import {unregister} from './registerServiceWorker';
import { Provider } from 'react-redux'

import {readStateFromLocalStore, newStore} from './store'

let store = newStore(readStateFromLocalStore())

ReactDOM.render(<Provider store={store}>
    <App/>
  </Provider>, document.getElementById('root'));
unregister();
