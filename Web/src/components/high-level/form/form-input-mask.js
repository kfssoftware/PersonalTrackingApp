import { Form } from 'antd';
import React from 'react';
import general from 'utils/general';
// import MaskedInput from 'antd-mask-input'
import i18next from 'i18next';

const FormInputMask = ({
    label,
    placeholder = "form.select.placeholder",
    value,
    errorMessage,
    onChange,
    prefix,
    suffix,
    antdFormItemProps,
    antdInputProps,
    rightAction,
    mask,
    addRequiredSign = false,
}) => {
    const onCahngeEvent = (e) => {
        if (onChange instanceof Function)
            onChange(e.target.value);
    }

    return (
        <Form.Item
            label={label + (addRequiredSign ? " *" : "")}
            validateStatus={general.isNullOrEmpty(errorMessage) ? "" : "error"}
            help={errorMessage}
            style={{ display: "flex" }}
            {...antdFormItemProps}
        >
            {/* <MaskedInput
                prefix={prefix}
                suffix={suffix}
                allowClear
                mask={mask}
                value={value}
                size="large"
                onChange={onCahngeEvent}
                placeholder={i18next.t(placeholder)}
                {...antdInputProps}
            /> */}
            {rightAction}
        </Form.Item>
    )
}

const areEqual = (prev, next) => {
    return prev.label === next.label
        && prev.placeholder === next.placeholder
        && prev.errorMessage === next.errorMessage
        && prev.mask === next.mask
        && prev.value == next.value;
}
export default React.memo(FormInputMask, areEqual);