import React from 'react'
import {ButtonGroup, Button} from 'react-bootstrap'
import _ from 'lodash'

export function SelectTimeRange(props) {
    function onClickF(st) {
        return function () {
            props.onSelected(st)
        }
    }
    return <ButtonGroup title="Sync">
    {
        _.map(props.options, st => <Button 
            key={st.name} 
            onClick={onClickF(st)}
            >{st.name}</Button>)
    }
    </ButtonGroup>
}