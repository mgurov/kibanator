import React from 'react'

export default function DateTime({ value, ...theRest }) {
    var date = new Date(value);
    return (<span title={value} {...theRest}>{date.toLocaleDateString() + " " + date.toLocaleTimeString()}</span>)
}