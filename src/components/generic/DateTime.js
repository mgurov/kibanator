import React from 'react'

export default function DateTime({ value, ...theRest }) {
    if (!value) {
        return <span>-</span>
    }
    var date = new Date(value);
    return (<span title={value} {...theRest}>{date.toLocaleDateString() + " " + date.toLocaleTimeString()}</span>)
}