import React, { useCallback, useEffect, useRef, useState } from "react"
import FilterContainer from "components/low-level/filter/filter-container"
import FormInput from "components/high-level/form/form-input";
import FormMultiSelect from "components/high-level/form/form-multi-select";
import { MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import general from "utils/general";
import FormInputMask from "components/high-level/form/form-input-mask";
import FormSelect from "components/high-level/form/form-select";
import i18next from 'i18next';
import { UserTypeEnum } from 'utils/enums'

const Filter = ({ filterData, saveFilter, toggleFilter, clearFilter }) => {
    const [filterDataHook, setFilterDataHook] = useState({});
    const timerRef = useRef(null);
    useEffect(() => {
        setFilterDataHook(filterData)
    }, [JSON.stringify(filterData)]);

    const updateFilter = useCallback((values) => {
        clearTimeout(timerRef?.current);
        let nextFilter = {};
        setFilterDataHook(curr => { nextFilter = { ...curr, ...values }; return nextFilter });
        timerRef.current = setTimeout(() => {
            saveFilter(nextFilter);
        }, 600);
    }, [timerRef, JSON.stringify(filterDataHook)]);

    const updateStatus = useCallback((values) => {
        if (values.statusValues != undefined)
            values.statusList = values.statusValues?.map(f => f.value)
        else
            values.statusList = [];
        updateFilter(values);
    }, []);

    const onClickClear = useCallback(() => {
        setFilterDataHook({})
        clearFilter();
    }, [])

    return <FilterContainer onClickClose={toggleFilter} onClickClear={onClickClear}>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <FormInput
                label="Job Name"
                placeholder="Job Name"
                onChange={val => updateFilter({ name: val })}
                value={filterDataHook?.name}
            />
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <FormSelect
                controller="Priority"
                label="Priority"
                selectedId={filterDataHook?.priority}
                selectedName={filterDataHook?.priorityName}
                onChange={e => updateFilter({ priority: e?.value, priorityName: e?.name })}
                getOptionLabel={option => option?.name}
            />
        </div>
    </FilterContainer >
}
const areEqual = (prev, next) => {
    return JSON.stringify(prev.filterData) === JSON.stringify(next.filterData)
        && prev.saveFilter === next.saveFilter
        && prev.clearFilter === next.clearFilter
}
export default React.memo(Filter, areEqual);