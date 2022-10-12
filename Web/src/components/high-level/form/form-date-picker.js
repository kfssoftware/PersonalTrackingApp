import { DatePicker, Form } from 'antd';
import React from 'react';
import general from 'utils/general';
import i18next from 'i18next';
import moment from 'moment'

const FormDatePicker = ({
    label,
    value,
    minDate,
    maxDate = moment().format(),
    placeholder = i18next.t("form.select.placeholder"),
    errorMessage,
    disabled,
    dateFormat = "DD.MM.YYYY",
    onChange,
    rightAction,
    style,
}) => {

    const onCahngeEvent = (e) => {
        if (onChange instanceof Function)
            onChange(e ? e.startOf('day').toISOString() : null);
    }

    const minDateHook = general.isNullOrEmpty(minDate) ? null : moment(minDate).startOf("day")
    const maxDateHook = general.isNullOrEmpty(maxDate) ? null : moment(maxDate).startOf("day")


    const disabledDate = (current) => {
        if (minDateHook && current && minDateHook > moment(current).startOf("day"))
            return true;
        if (maxDateHook && current && maxDateHook < moment(current).startOf("day"))
            return true;
        return false;
    }

    return (
        <>
            <h6 style={{ fontWeight: 500 }}>{general.isNullOrEmpty(label) ? null : label}</h6>
            <Form.Item
                validateStatus={general.isNullOrEmpty(errorMessage) ? "" : "error"}
                help={errorMessage}
                style={style}
            >
                <DatePicker
                    style={{ display: "block", width: "100%" }}
                    disabledDate={disabledDate}
                    disabled={disabled}
                    value={value ? moment(value) : null}
                    size="large"
                    allowClear
                    onChange={onCahngeEvent}
                    placeholder={placeholder}
                    // defaultValue={defaultValue}
                    format={dateFormat}
                />
                {rightAction}
            </Form.Item>
        </>
    )
}

const areEqual = (prev, next) => {
    return prev.label === next.label
        && JSON.stringify(prev.value) === JSON.stringify(next.value)
        && JSON.stringify(prev.minDate) === JSON.stringify(next.minDate)
        && JSON.stringify(prev.maxDate) === JSON.stringify(next.maxDate)
        && JSON.stringify(prev.style) === JSON.stringify(next.style)
        && prev.placeholder === next.placeholder
        && prev.dateFormat === next.dateFormat
        && prev.errorMessage === next.errorMessage
        && prev.disabled === next.disabled
}
export default React.memo(FormDatePicker, areEqual);