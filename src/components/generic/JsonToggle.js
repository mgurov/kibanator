import React from 'react'
import {Button} from 'reactstrap'

export default class JsonToggle extends React.Component {
    constructor(props) {
        super(props)
        this.state = {visible: false}
    }

    render() {
        let toggle = (e) => {
            e.preventDefault()
            this.setState({visible: !this.state.visible})
        }
        let result = [<Button size="sm" key="toggle" onClick={toggle}>{this.props.text || 'json'}</Button>]
        if (this.state.visible) {
            result.push(<JsonPre key="value" value={this.props.value}/>)
        }
        return result
    }
}

export const JsonPre = ({value}) => <pre>{JSON.stringify(value, '', '  ')}</pre>