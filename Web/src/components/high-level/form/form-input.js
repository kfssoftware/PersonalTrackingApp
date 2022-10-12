import { DownloadOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import i18next from 'i18next';
import React from 'react';
import general from 'utils/general';
import FormAction from './form-action';

const FormInput = ({
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
    multiLine = false,
    rows = 10,
    cols = 10,
    addRequiredSign = false,
    disabled,
    onKeyPress
}) => {

    const onCahngeEvent = (e) => {
        if (onChange instanceof Function)
            onChange(e.target.value);
    }
    const onClickEvent = (e) => {
        if (onClick instanceof Function)
            onClick(e.target.value);
    }

    return (
        <>
            <h6 style={{fontWeight:500}}>{general.isNullOrEmpty(label) ? null : label + (addRequiredSign ? " *" : "")}</h6>
            <Form.Item
                validateStatus={general.isNullOrEmpty(errorMessage) ? "" : "error"}
                help={errorMessage}
                style={{ display: "flex", }}

                {...antdFormItemProps}
            >
                {!multiLine &&
                    <Input
                        prefix={prefix}
                        suffix={suffix}
                        allowClear
                        onKeyPress={onKeyPress}
                        value={value}
                        disabled={disabled}
                        size="large"
                        onChange={onCahngeEvent}
                        onClick={onClickEvent}
                        placeholder={placeholder}
                        {...antdInputProps}
                    />
                }

                {multiLine &&
                    <TextArea
                        prefix={prefix}
                        suffix={suffix}
                        allowClear
                        onKeyPress={onKeyPress}
                        value={value}
                        rows={rows}
                        cols={cols}
                        size="large"
                        disabled={disabled}
                        onChange={onCahngeEvent}
                        onClick={onClickEvent}
                        placeholder={placeholder}
                        {...antdInputProps}
                    />
                }
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
export default React.memo(FormInput, areEqual);