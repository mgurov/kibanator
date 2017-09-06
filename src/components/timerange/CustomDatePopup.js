import React from 'react';

function CustomDatePopup({close}) {
    return <span className="static-modal">
    <Modal show={true} onHide={close}>
        <Modal.Header closeButton>
            <Modal.Title>Select the starting range</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <form onSubmit={this.submit}>

                <FieldGroup
                    {...fieldProps("timeField")}
                    label="Time Field"
                    help="e.g. @timestamp"
                    autoFocus
                />

                <FieldGroup
                    {...fieldProps("messageField")}
                    label="Message Field"
                    help="e.g. @message"
                />

                <FieldGroup
                    {...fieldProps("serviceField")}
                    label="Service Field"
                    help="e.g. @fields.application"
                />

                <FieldGroup
                    {...fieldProps("serviceName")}
                    label="Service Name"
                    help="e.g. wps or webfrontende"
                />

                <FieldGroup
                    {...fieldProps("levelField")}
                    label="Level Field"
                    help="e.g. @fields.level"
                />

                <FieldGroup
                    {...fieldProps("levelValue")}
                    label="Level"
                    help="e.g. ERROR, WARN, INFO or DEBUG"
                />

                <FieldGroup
                    {...fieldProps("index")}
                    label="Index"
                    help="e.g. logstash-tst-log4json-*"
                />

            </form>
        </Modal.Body>

        <Modal.Footer>
            <Button onClick={close}>Close</Button>
            <Button bsStyle="primary"
                onClick={this.submit}
                disabled={this.props.disabled}
                title="Save the changes"
            >
                Save changes
            </Button>
        </Modal.Footer>

    </Modal>
</span>
}