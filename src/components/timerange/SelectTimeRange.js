import React from 'react'
import {
    ButtonGroup, 
    Button, 
} from 'reactstrap';
import _ from 'lodash'
import CustomSelectionButton from './CustomSelectionButton'

export function SelectTimeRange(props) {

    let options = _.map(props.options, st => <Button className="preselected-time-range"
        key={st.name} 
        data-test-id={`range-button-${st.name}`}
        data-test-class="range-button"
        onClick={() => props.onSelected(st)}
        >{st.name}</Button>)

    return <ButtonGroup title="Sync">
        {
            options
        }
        <CustomSelectionButton onSelected={props.onSelected} />
    </ButtonGroup>
}
