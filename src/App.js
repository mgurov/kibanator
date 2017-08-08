import React, { Component } from 'react';
import './App.css';
import Watch from './components/Watch.js'
import EditWatch from './components/EditWatch.js'
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
    const watches = this.state.watches.map((k, v) => (<Watch key={'item_' + k.id} name={k.text} onClick={() => this.onEditClick(k)} />))
    watches.push((<Watch key='+' name='+' onClick={this.onAddWatch} />))
    watches.push((<AddWatchContainer key='++' />))

    let editWindow;
    if (this.state.showModal) {
      editWindow = <EditWatch 
        store={this.props.store}
        onClose={this.onDialogClose} 
        watch={this.state.showModal}
        />
    } else {
      editWindow = null
    }

    return (
      <div className="App">
        {editWindow}
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        {watches}
        <br/>
        <WatchListContainer />
      </div>
    );
  }
}

export default App;
