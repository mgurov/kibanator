import React from 'react'
import {FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap'

class PasteJsonButton extends React.Component {
    constructor(props) {
        super(props)

        const initialState = {
            value: JSON.stringify(props.value, "  ", 2),
            parsingError: null,
        }

        this.state = initialState

        this.submit = (e) => {
            e.preventDefault()
        }

        this.onValueChange = (e) => {
            const value = e.target.value;
            let parsingError = null
            try {
                props.onJsonEdited(JSON.parse(value))
            } catch(e) {
                parsingError = e
            }
            this.setState({value, parsingError})
        }

        this.revert = () => {
            this.setState(initialState)
        }

    }

    render() {
        return <FormGroup controlId="formControlsTextarea" validationState={this.state.parsingError == null ? null : "error"}>
        <ControlLabel>JSON</ControlLabel>
        {this.state.parsingError && <HelpBlock>{"" + this.state.parsingError} <Button onClick={this.revert}>revert</Button> </HelpBlock>}
        <FormControl componentClass="textarea" placeholder="textarea" value={this.state.value} onChange={this.onValueChange} rows="25" />
      </FormGroup>
    }

}

export default PasteJsonButton
