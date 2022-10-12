import { Form, Select } from 'antd';
import i18next from 'i18next';
import React from 'react';
import general from 'utils/general';

const FormInputTag = ({
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
    disabled
}) => {

    const onCahngeEvent = (e) => {
        if (onChange instanceof Function)
            onChange(e);
    }

    return (
        <Form.Item
            label={label}
            validateStatus={general.isNullOrEmpty(errorMessage) ? "" : "error"}
            help={errorMessage}
            style={{ display: "flex", }}

            {...antdFormItemProps}
        >
            <Select
                mode="tags"
                prefix={prefix}
                suffix={suffix}
                allowClear
                value={value}
                disabled={disabled}
                size="large"
                onChange={onCahngeEvent}
                placeholder={i18next.t(placeholder)}
                {...antdInputProps}
            >


            </Select>


            {rightAction}
        </Form.Item>
    )
}

const areEqual = (prev, next) => {
    return prev.label === next.label
        && prev.placeholder === next.placeholder
        && prev.errorMessage === next.errorMessage
        && prev.disabled === next.disabled
        && prev.value == next.value;
}
export default React.memo(FormInputTag, areEqual);