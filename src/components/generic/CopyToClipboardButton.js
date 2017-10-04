import React from 'react'
import {Button} from 'react-bootstrap'

export default function CopyToClipboardButton({value}) {
    return <Button className="glyphicon glyphicon-copy" bsSize="xsmall" onClick={copyText(value)}></Button>
}

function copyText(text) {
    return () => {
        var textField = document.createElement('textarea')
        textField.innerText = text
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
    }
}