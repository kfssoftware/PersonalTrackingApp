import { Form, Input } from 'antd';
import i18next from 'i18next';
import React from 'react';
import general from 'utils/general';
const FormInputPassword = ({
    label,
    placeholder = "form.select.placeholder",
    value,
    errorMessage,
    onChange,
    prefix,
    suffix,
    antdFormItemProps,
    antdInputProps,
    disabled,
    addRequiredSign = false,
}) => {

    const onCahngeEvent = (e) => {
        if (onChange instanceof Function)
            onChange(e.target.value);
    }

    return (
        <>
            {label && <h6 style={{ fontWeight: 500 }}>{label + (addRequiredSign ? " *" : "")}</h6>}
            <Form.Item
                validateStatus={general.isNullOrEmpty(errorMessage) ? "" : "error"}
                help={errorMessage}
                style={{ display: "flex", }}

                {...antdFormItemProps}
            >

                <Input.Password
                    prefix={prefix}
                    suffix={suffix}
                    allowClear
                    value={value}
                    disabled={disabled}
                    size="large"
                    onChange={onCahngeEvent}
                    placeholder={i18next.t(placeholder)}
                    {...antdInputProps}
                />
            </Form.Item>
        </>
    )
}

const areEqual = (prev, next) => {
    return prev.label === next.label
        && prev.placeholder === next.placeholder
        && prev.errorMessage === next.errorMessage
        && prev.disabled === next.disabled
        && prev.value == next.value;
}
export default React.memo(FormInputPassword, areEqual);