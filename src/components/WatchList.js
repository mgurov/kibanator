import React, { Component } from 'react';
import Watch from './Watch'
import PropTypes from 'prop-types';

class WatchList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editing : false
        }
        this.onEditClick = (watch) => {
            console.log('Clocked on ', watch)
        }
    }

    render() {
        var watches = this.props.watches.map((k, v) => (<Watch key={'item_' + k.id} name={k.text} onClick={() => this.onEditClick(k)} />))
        return (<div>{watches}</div>)
    }
}

WatchList.propTypes = {
  onWatchEdited: PropTypes.func.isRequired,
  onWatchDeleted: PropTypes.func.isRequired,
  watches : PropTypes.array.isRequired,
}

export default WatchList;