import React from 'react'

import {
    Input,
    InputGroup,
    InputGroupAddon,
    FormGroup,
    Button
} from 'reactstrap'
import DateTime from '../generic/DateTime'
import _ from 'lodash'

class CustomDatePopupForm extends React.Component {
    constructor(props) {
        super(props)
        let {value, onSubmit} = props
        this.state = {value}

        let that = this

        this.handleChange = (e) => {
            that.setState({ value: e.target.value });
        }

        this.submit = (event) => {
            event.preventDefault();
            let d = Date.parse(this.state.value)
            if (!_.isNaN(d)) {
                onSubmit(d)
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
          <FormGroup>
              <InputGroup>
                    <Input
                        invalid={this.getValidationState() === 'error'}
                        value={this.state.value}
                        onChange={this.handleChange}
                    />
                    <InputGroupAddon addonType="append"><Button disabled={'error' === this.getValidationState()} onClick={this.submit}>go</Button></InputGroupAddon>
                </InputGroup>
            <DateTime value={this.state.value}/>
          </FormGroup>
        </form>
      );
    }
  }

  export default CustomDatePopupForm