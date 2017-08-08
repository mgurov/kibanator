import React, { Component } from 'react';
import './App.css';
import AddWatchContainer from './components/AddWatchContainer.js'
import WatchListContainer from './components/WatchListContainer.js'
import _ from 'lodash'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
        watches: this.getStoreWatches(),
        showModal: false 
    }
    this.onAddWatch = _.bind(this.onAddWatch, this)
    this.onDialogClose = _.bind(this.onDialogClose, this)
    this.onEditClick = (watch) => {
      this.setState({showModal: watch})
    }
  }

  componentDidMount() {
    let that = this;
    this.unsubscribe = this.props.store.subscribe(() => {
      window.setTimeout(() => {
        that.setState(_.assign({}, that.state, {watches: that.getStoreWatches()}))
      })
      
    })
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }

  getStoreWatches() {
    return this.props.store.getState().watches
  }

  onAddWatch() {
    this.setState({ showModal: {text : ""}})
  }

  onDialogClose(value) {
    this.setState({showModal: false})
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <WatchListContainer />
        <AddWatchContainer/>
      </div>
    );
  }
}

export default App;
