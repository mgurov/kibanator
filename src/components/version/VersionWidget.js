import React from 'react'
import { connect } from 'react-redux'
import { Popover, Button, Alert, PopoverHeader, PopoverBody } from 'reactstrap'

const mapStateToProps = state => {
    return {
        versions: state.versions,
    }
}

function VersionWidget({versions}) {

    if (!versions.server || versions.current === versions.server) {
        return <span>{versions.current}</span>
    } else {
        return <VersionDeviated versions={versions} />
    }
}

class VersionDeviated extends React.Component {
    constructor(props) {
        super(props)
        this.state = {popoverShown: false}
        this.togglePopover = () => {
            this.setState({popoverShown: !this.state.popoverShown})
        }
    }

    render() {
        let reload = () => window.location.reload(true)
        let versions = this.props.versions

        return <>
                <Button color="warning" id="version-popover-button" onClick={this.togglePopover}>{versions.current}</Button>
                <Popover id="popover-version" isOpen={this.state.popoverShown} toggle={this.togglePopover} target="version-popover-button">
                <PopoverHeader>Server version differs</PopoverHeader>
                <PopoverBody>
                    <Alert color="secondary">
                        Server is ready to serve <strong>{versions.server}</strong> Consider <Button size="sm" color="primary" onClick={reload}>reloading</Button> the window.
                    </Alert>
                    <Alert color="warning">
                    Acks and marked lines will be lost upon reload.
                </Alert>
                </PopoverBody>
            </Popover>
        </>
    }
}

export default connect(mapStateToProps)(VersionWidget);