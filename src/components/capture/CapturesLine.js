import React from 'react'
import _ from 'lodash'
import CaptureButton from './CaptureButton'

export default function CapturesLine(props) {
    let result
    if (_.isEmpty(props.value)) {
        result =  null
    } else {
        result = <div>{_.map(props.value, (v, k) => <CaptureButton key={k}  captureKey={k} capture={v} /> )}</div>
    }
    return result
}