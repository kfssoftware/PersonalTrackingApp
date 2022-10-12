import { DatePicker, Form, Radio } from 'antd';
import i18next from 'i18next';
import React from 'react';
import general from 'utils/general';
import moment from 'moment'

const { RangePicker } = DatePicker;
const FormRangePicker = ({
    label,
    value,
    minDate,
    maxDate,
    placeholders = [i18next.t("form.select.placeholder"), i18next.t("form.select.placeholder")],
    errorMessage,
    disabled,
    rightAction,
    dateFormat = "DD.MM.YYYY",
    onChange,
}) => {

    // const onCahngeEvent = (e) => {
    //     if (onChange instanceof Function)
    //         onChange(e);
    // }

    // const minDateHook = minDate?.setHours(0,0,0,0);
    // const maxDateHook = maxDate?.setHours(0,0,0,0);


    // const disabledDate = (current) => {
    //     if (minDateHook && current && minDateHook > current)
    //         return true;
    //     if (maxDateHook && current && maxDateHook < current)
    //         return true;
    //     return false;
    // }


    const onCahngeEvent = (e) => {
        if (onChange instanceof Function)
            onChange(e);
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
        <Form.Item
            label={label}
            validateStatus={general.isNullOrEmpty(errorMessage) ? "" : "error"}
            help={errorMessage}
        >
            <RangePicker
                style={{ display: "flex", width: "100%" }}
                disabledDate={disabledDate}
                disabled={disabled}
                value={value}
                size="large"
                allowClear
                onChange={onCahngeEvent}
                placeholder={placeholders}
                // placeholder={placeholder}
                // defaultValue={defaultValue}
                format={dateFormat}
            />
            {rightAction}
        </Form.Item>
    )
}

const areEqual = (prev, next) => {
    return prev.label === next.label
        && JSON.stringify(prev.value) === JSON.stringify(next.value)
        && JSON.stringify(prev.minDate) === JSON.stringify(next.minDate)
        && JSON.stringify(prev.maxDate) === JSON.stringify(next.maxDate)
        && JSON.stringify(prev.placeholders) === JSON.stringify(next.placeholders)
        && prev.dateFormat === next.dateFormat
        && prev.errorMessage === next.errorMessage
        && prev.disabled === next.disabled
}
export default React.memo(FormRangePicker, areEqual);