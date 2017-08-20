import React from 'react';
import { OverlayTrigger } from 'react-bootstrap'

export default function ConditionalOverlayTrigger(props) {
    let { visible, children, ...rest } = props

    if (visible) {
        return (<OverlayTrigger {...rest}>
            {children}
        </OverlayTrigger>);
    } else {
        return children
    }
}