import React from 'react'
import CaptureEditForm from './CaptureEditForm'
import {Popover, OverlayTrigger} from 'react-bootstrap'

export default function CaptureButton({captureKey, capture}) {
    let popover = <Popover id="capture-popover" title="Capture">
        <CaptureEditForm {...{captorKey:captureKey}} />
    </Popover>

    let button = <button
        className="btn btn-default btn-xs">
            {captureKey} <span className="badge">{capture.length}</span>
        </button>

    let overlaid = <OverlayTrigger trigger="click" rootClose overlay={popover}>{button}</OverlayTrigger>

    return overlaid
}
