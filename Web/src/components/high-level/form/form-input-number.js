import { DownloadOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber } from 'antd';
import i18next from 'i18next';
import React from 'react';
import general from 'utils/general';
import FormAction from './form-action';

const FormInputNumber = ({
    label,
    placeholder = "form.select.placeholder",
    value,
    errorMessage,
    onChange,
    onClick,
    prefix,
    suffix,
    antdFormItemProps,
    antdInputProps,
    rightAction,
    addRequiredSign = false,
    disabled,
    onKeyPress
}) => {

    const onChangeEvent = (e) => {
        console.log(e);
        if (onChange instanceof Function)
            onChange(e);
    }
    const onClickEvent = (e) => {
        if (onClick instanceof Function)
            onClick(e.target.value);
    }

    return (
        <>
            <h6 style={{ fontWeight: 500 }}>{general.isNullOrEmpty(label) ? null : label + (addRequiredSign ? " *" : "")}</h6>
            <Form.Item
                validateStatus={general.isNullOrEmpty(errorMessage) ? "" : "error"}
                help={errorMessage}
                style={{ display: "flex", }}

                {...antdFormItemProps}
            >
                <InputNumber
                    prefix={prefix}
                    suffix={suffix}
                    allowClear
                    formatter={(value) =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    onKeyPress={onKeyPress}
                    value={value}
                    disabled={disabled}
                    size="large"
                    style={{ width: '100%' }}
                    onChange={onChangeEvent}
                    onClick={onClickEvent}
                    placeholder={i18next.t(placeholder)}
                    {...antdInputProps}
                />
                {rightAction}
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
export default React.memo(FormInputNumber, areEqual);