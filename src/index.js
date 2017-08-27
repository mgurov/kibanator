import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'

import store from './store'

ReactDOM.render(<Provider store={store}>
    <App store={store}/>
  </Provider>, document.getElementById('root'));
registerServiceWorker();
