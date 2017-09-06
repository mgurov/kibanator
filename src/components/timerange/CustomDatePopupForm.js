import React from 'react'

import {
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
} from 'react-bootstrap';
import DateTime from '../generic/DateTime'
import _ from 'lodash'

class CustomDatePopupForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {value: props.value}

        let that = this

        this.handleChange = (e) => {
            that.setState({ value: e.target.value });
        }

        this.submit = (event) => {
            event.preventDefault();
            let d = Date.parse(this.state.value)
            if (!_.isNaN(d)) {
                that.props.onSubmit(d)
            }
        }
    }
  
    getValidationState() {
        let d = Date.parse(this.state.value)
        if (_.isNaN(d)) {
            return 'error'
        } else {
            return 'success'
        }
    }  
  
    render() {
      return (
        <form onSubmit={this.submit}>
          <FormGroup
            controlId="formBasicText"
            validationState={this.getValidationState()}
          >
            <ControlLabel>Show logs starting from:</ControlLabel>
            <FormControl
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
            <HelpBlock><DateTime value={this.state.value}/></HelpBlock>
          </FormGroup>
        </form>
      );
    }
  }

  export default CustomDatePopupForm