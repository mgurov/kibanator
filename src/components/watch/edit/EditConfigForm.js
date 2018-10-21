import React from 'react'
import {
    FormGroup,
    Label,
    Input,
    FormText,
} from 'reactstrap'

export default function EditConfigForm({
    onSubmit,
    onChange,
    disabled,
    values
}) {

    let onControlChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.id;
        onChange(name, value)
    }


    let fieldProps = (id) => ({
        id,
        value: values[id],
        onChange: onControlChange,
        disabled: disabled,
        type: "text",
    })


    return <form onSubmit={onSubmit}>

        <FieldGroup
            {...fieldProps("serviceField")}
            label="Service Field"
            help="e.g. @fields.application"
        />

        <FieldGroup
            {...fieldProps("serviceName")}
            label="Service Name"
            help="e.g. wps or webfrontend. Comma separates."
            autoFocus
        />

        <FieldGroup
            {...fieldProps("levelField")}
            label="Level Field"
            help="e.g. @fields.level"
        />

        <FieldGroup
            {...fieldProps("levelValue")}
            label="Level"
            help="e.g. ERROR, WARN, INFO or DEBUG. Comma separates."
        />

        <FieldGroup
            {...fieldProps("timeField")}
            label="Time Field"
            help="e.g. @timestamp"
        />

        <FieldGroup
            {...fieldProps("messageField")}
            label="Message Field"
            help="e.g. @message"
        />

        <FieldGroup
            {...fieldProps("index")}
            label="Index"
            help="e.g. logstash-pro-log4json-*"
        />


    </form>

}

function FieldGroup({label, help, ...rest }) {
    return (
        <FormGroup>
            <Label>{label}</Label>
            <Input {...rest}/>
            {help && <FormText>{help}</FormText>}
        </FormGroup>
    );
}