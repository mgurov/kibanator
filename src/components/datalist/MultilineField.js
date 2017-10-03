import React from 'react'
import {Button} from 'react-bootstrap'

class MultilineField extends React.Component {
    constructor(props) {
        super(props)

        let that = this

        this.onSelect = function() {
            var range = document.createRange();    
            range.selectNodeContents(that.textHolder);

            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
    
            document.execCommand('copy')
        }
    }

    render() {
        let {k: key,v: value} = this.props 
        let copyButton = <Button className="glyphicon glyphicon-copy" bsSize="xsmall" title="copy to clipboard" onClick={this.onSelect}></Button>
        return <div>
                {copyButton} <label>{key}:</label> 
                <pre ref={(textHolder) => { this.textHolder = textHolder }}>{value}</pre>
            </div>
    }
}

export default MultilineField