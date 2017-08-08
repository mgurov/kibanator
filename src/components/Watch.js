import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class Watch extends Component {
  render() {
    return (
      <Button onClick={this.props.onClick}>{this.props.name}</Button>
    );
  }
}

export default Watch;