import React from 'react'
import {
    ButtonGroup, 
    Button, 
} from 'reactstrap';
import _ from 'lodash'
import CustomSelectionButton from './CustomSelectionButton'

const defaultOptions = [
    { name: '15 mins', nowToStart: now => now.setMinutes(now.getMinutes() - 15) },
    { name: '1 hour', nowToStart: now => now.setHours(now.getHours() - 1) },
    { name: '1 day', nowToStart: now => now.setDate(now.getDate() - 1) },
    { name: 'yesterday 17:00', nowToStart: now => {
        now.setDate(now.getDate() - 1)
        now.setHours(17)
        now.setMinutes(0)
        now.setSeconds(0)
        now.setMilliseconds(0)
        return now
    }},
    { name: 'Friday 17:00', nowToStart: now => {
        now.setDate(now.getDate() - 1)
        while (now.getDay() !== 5) {
            now.setDate(now.getDate() - 1)
        }
        now.setHours(17)
        now.setMinutes(0)
        now.setSeconds(0)
        now.setMilliseconds(0)
        return now
    }},
]

export function SelectTimeRange({onSelected}) {

    let options = _.map(defaultOptions, st => <Button className="preselected-time-range"
        key={st.name} 
        data-test-id={`range-button-${st.name}`}
        data-test-class="range-button"
        onClick={() => onSelected(st)}
        >{st.name}</Button>)

    return <ButtonGroup title="Sync">
        {
            options
        }
        <CustomSelectionButton onSelected={onSelected} />
    </ButtonGroup>
}
