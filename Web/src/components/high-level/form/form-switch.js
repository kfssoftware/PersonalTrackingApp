import { Form, Switch } from 'antd';
import React from 'react';
import general from 'utils/general';

const FormSwitch = ({
    label,
    text,
    checked,
    errorMessage,
    disabled,
    onChange,
    checkedChildren,
    unCheckedChildren
}) => {

    const onCahngeEvent = e => {
        if (onChange instanceof Function)
            onChange(e);
    }

    return (
        <>
            <h6 style={{fontWeight:500}}>{label}</h6>
            <Form.Item
                validateStatus={general.isNullOrEmpty(errorMessage) ? "" : "error"}
                help={errorMessage}
                valuePropName="checked"
            >
                {text}
                <Switch checkedChildren={checkedChildren} unCheckedChildren={unCheckedChildren} style={{ marginLeft: 10 }} disabled={disabled} checked={checked} onChange={onCahngeEvent} />
            </Form.Item >
        </>
    )
}

const areEqual = (prev, next) => {
    return prev.label === next.label
        && prev.errorMessage === next.errorMessage
        && prev.text === next.text
        && prev.checkedChildren === next.checkedChildren
        && prev.unCheckedChildren === next.unCheckedChildren
        && prev.disabled === next.disabled
        && prev.checked == next.checked;
}
export default React.memo(FormSwitch, areEqual);