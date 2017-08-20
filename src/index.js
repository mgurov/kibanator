import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import thunkMiddleware from 'redux-thunk'
//import { createLogger } from 'redux-logger'

import kibanatorApp from './reducers'
import {getNextId} from './actions'

let watches = JSON.parse(localStorage.getItem('watches') || '[]')
    .map((v) => { return { id : getNextId(), text: v.text }})
let store = createStore(
    kibanatorApp, 
    {watches},
    applyMiddleware(thunkMiddleware /* , createLogger() */)
)
store.subscribe(() => localStorage.setItem('watches', JSON.stringify(store.getState().watches)))

ReactDOM.render(<Provider store={store}>
    <App store={store}/>
  </Provider>, document.getElementById('root'));
registerServiceWorker();
