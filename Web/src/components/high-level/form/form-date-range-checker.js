import ButtonGroup from 'antd/lib/button/button-group';
import React, { useState } from 'react';
import general from 'utils/general';
import FormAction from './form-action';

const FormDateRangeChecker = ({ onChange,threeMonthLabel,placeholder,value,sixMonthLabel,allLabel }) => {

    value=general.isNullOrEmpty(value)?0:value;
    const onCahngeEvent = (e) => {
        if (onChange instanceof Function)
            onChange(e);
    }

    return (
        <div class="ant-row ant-form-item">
            <div class="ant-col ant-form-item-label">
                <label>{placeholder}</label>
            </div>
            <ButtonGroup>
                <FormAction text={threeMonthLabel} buttonType={value == 3 ? "warning" : "light"} onClick={() => onCahngeEvent(3)} />
                <FormAction text={sixMonthLabel} buttonType={value == 6 ? "warning" : "light"} onClick={() => onCahngeEvent(6)} />
                <FormAction text={allLabel} buttonType={value == 0 ? "warning" : "light"} onClick={() => onCahngeEvent(0)} />
            </ButtonGroup>
        </div>
    );

}

const areEqual = (prev, next) => {
    return JSON.stringify(prev.value) === JSON.stringify(next.value)
        && JSON.stringify(prev.threeMonthLabel) === JSON.stringify(next.threeMonthLabel)
        && JSON.stringify(prev.sixMonthLabel) === JSON.stringify(next.sixMonthLabel)
        && prev.errorMessage === next.errorMessage
}
export default React.memo(FormDateRangeChecker, areEqual);