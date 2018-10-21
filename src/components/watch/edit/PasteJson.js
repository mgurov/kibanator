import React from 'react'
import {FormGroup, Input, Alert, Button} from 'reactstrap'

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
        return <FormGroup>
        {this.state.parsingError && <Alert color="danger">{"" + this.state.parsingError + " "} <Button color="primary" onClick={this.revert}>revert</Button> </Alert>}
        <Input type="textarea" placeholder="textarea" value={this.state.value} onChange={this.onValueChange} rows="25" invalid={this.state.parsingError != null} />
      </FormGroup>
    }

}

export default PasteJsonButton
