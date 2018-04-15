import React from 'react'
import {Button} from 'react-bootstrap'

export class JsonToggle extends React.Component {
    constructor(props) {
        super(props)
        this.state = {visible: false}
    }

    render() {
        let toggle = () => this.setState({visible: !this.state.visible})
        let result = [<Button bsSize="xsmall" bsStyle="default" key="toggle" onClick={toggle}>{this.props.text}</Button>]
        if (this.state.visible) {
            result.push(<pre key="value">{JSON.stringify(this.props.value, '', '  ')}</pre> )
        }
        return result
    }
}

export default JsonToggle