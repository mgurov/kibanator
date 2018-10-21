import React from 'react'
import CustomDatePopupForm from './CustomDatePopupForm'
import {
    Button,
    Popover,
    PopoverBody,
    PopoverHeader,
} from 'reactstrap';

class CustomSelectionButton extends React.Component {

    constructor(props) {
        super(props)

        this.state = {popoverOpen : false}

        this.togglePopover = () => this.setState({popoverOpen: !this.state.popoverOpen})

        this.onCustomSelect = (selectedTimestamp) => {
            props.onSelected({ name: 'custom', nowToStart: () => selectedTimestamp })
        }
    }


    render() {
        return <>
            <Button id="custom-selection-popover-trigger" onClick={this.togglePopover}>Custom...</Button>
            <Popover id="custom-selection-popover" target="custom-selection-popover-trigger" isOpen={this.state.popoverOpen} toggle={this.togglePopover} >
                <PopoverHeader>Show logs starting from</PopoverHeader>
                <PopoverBody>
                    <CustomDatePopupForm value={new Date()} onSubmit={this.onCustomSelect} />
                </PopoverBody>
            </Popover>
        </>
    }

}

export default CustomSelectionButton;