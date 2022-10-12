import { Form, Radio } from 'antd';
import React from 'react';
import general from 'utils/general';

const FormRadioButton = ({
    label,
    value,
    options, // [{name:"",value:""}]
    errorMessage,
    disabled,
    onChange,
}) => {

    const onCahngeEvent = (e) => {
        if (onChange instanceof Function)
            onChange(e.target.value);
    }

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };

    return (
        <Form.Item
            label={label}
            validateStatus={general.isNullOrEmpty(errorMessage) ? "" : "error"}
            help={errorMessage}
        >
            <Radio.Group disabled={disabled} onChange={onCahngeEvent} value={value}>
                {options?.map((option, index) => <Radio key={index} style={radioStyle} value={option?.value} >{option?.name}</Radio>)}
            </Radio.Group>
        </Form.Item>
    )
}

const areEqual = (prev, next) => {
    return prev.label === next.label
        && prev.errorMessage === next.errorMessage
        && prev.disabled === next.disabled
        && prev.value === next.value
        && JSON.stringify(prev.options) === JSON.stringify(next.value)
        && prev.checked == next.checked;
}
export default React.memo(FormRadioButton, areEqual);