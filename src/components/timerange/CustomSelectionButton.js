import React from 'react'
import CustomDatePopupForm from './CustomDatePopupForm'
import {
    Button, 
    Popover, 
    OverlayTrigger,
} from 'react-bootstrap';

function CustomSelectionButton(props) {

    const onCustomSelect = (selectedTimestamp) => {
        props.onSelected({ name: 'custom', nowToStart: () => selectedTimestamp })
    }

    const customSelectionPopover = (
        <Popover id="custom-selection-popover">
            <CustomDatePopupForm value={new Date()} onSubmit={onCustomSelect} />
        </Popover>
    );

    return (<OverlayTrigger trigger="click" rootClose placement="left" overlay={customSelectionPopover}>
        <Button>Custom...</Button>
    </OverlayTrigger>)
}

export default CustomSelectionButton;