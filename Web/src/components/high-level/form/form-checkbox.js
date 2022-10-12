import { Checkbox, Form } from 'antd';
import React from 'react';
import general from 'utils/general';

const FormCheckbox = ({
    label,
    text,
    checked,
    errorMessage,
    disabled,
    onChange,
}) => {

    const onCahngeEvent = (e) => {
        if (onChange instanceof Function)
            onChange(e.target.checked);
    }

    return (
        <Form.Item
            label={label}
            validateStatus={general.isNullOrEmpty(errorMessage) ? "" : "error"}
            help={errorMessage}
            valuePropName="checked"
        >
            <Checkbox disabled={disabled} checked={checked} value={checked} onChange={onCahngeEvent} >
                {text}
            </Checkbox>
        </Form.Item >
    )
}

const areEqual = (prev, next) => {
    return prev.label === next.label
        && prev.errorMessage === next.errorMessage
        && prev.text === next.text
        && prev.disabled === next.disabled
        && prev.checked == next.checked;
}
export default React.memo(FormCheckbox, areEqual);