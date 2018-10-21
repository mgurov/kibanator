import React from 'react'
import {Button} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class LogRowFieldValue extends React.Component {
    constructor(props) {
        super(props)

        let {multiline, value} = props
        this.fieldName = props.fieldName
        this.filterButton = props.filterButton

        if (multiline) {
            let onSelect = () => {
                var range = document.createRange();    
                range.selectNodeContents(this.textHolder);
    
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
        
                document.execCommand('copy')
            }

            this.copyButton = <Button size="sm" title="copy to clipboard" onClick={onSelect}><FontAwesomeIcon icon="copy"/></Button>
            this.renderedValue = <pre ref={(textHolder) => { this.textHolder = textHolder }}>{value}</pre>
        } else {
            this.renderedValue = value
        }
    }

    render() {
        return <div className="field-row">
                {this.filterButton} {this.copyButton} <label>{this.fieldName}:</label> 
                {this.renderedValue}
            </div>

    }
}

export default LogRowFieldValue