import React from 'react'

export default function DateTime({ value }) {
    var date = new Date(value);
    return (<span title={value}>{date.toLocaleDateString() + " " + date.toLocaleTimeString()}</span>)
}