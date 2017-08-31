import React from 'react'
import {ButtonGroup, Button} from 'react-bootstrap'
import _ from 'lodash'

export function SelectTimeRange(props) {
    return <ButtonGroup title="Sync">
    {
        _.map(props.options, st => <Button 
            key={st.name} 
            onClick={() => props.onSelected(st)}
            >{st.name}</Button>)
    }
    </ButtonGroup>
}