import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import general from 'utils/general';
import { AsyncPaginate } from 'react-select-async-paginate';
import { useDispatch } from 'react-redux';
import { Actions as ApiCallActions } from "redux/apiCall/reducers";
import i18next from 'i18next';


const FormMultiSelect = ({
    label,
    placeholder = i18next.t("form.select.placeholder"),
    loadAndSelectIdList = [],
    value,
    errorMessage,
    antdFormItemProps = {},
    onChange = (options, ids) => { },
    disabled,
    controller = "user",
    action = "dropdown",
    filter,
    searchTextKey = "searchText",
    isClearable = true,
    rightAction,
    usei18next,
    getOptionLabel = (option) => usei18next ? i18next.t(option?.name) : (option?.name)

}) => {
    const dispatch = useDispatch()
    const [clearCache, setClearCache] = useState([general.generateRandomString(10)]);

    useEffect(() => {
        if (loadAndSelectIdList?.length > 0)
            dispatch(ApiCallActions.List({
                controller: controller,
                action: action,
                data: {
                    idList: loadAndSelectIdList
                },
                showAlertOnError: true,
                onSuccess: ({ data }) => {
                    if (onChange instanceof Function)
                        onCahngeEvent(data)
                }
            }))
    }, [JSON.stringify(loadAndSelectIdList)]);

    const onCahngeEvent = (e) => {
        if (onChange instanceof Function) {
            onChange(e, e?.map(x => x?.value));
        }
    }

    const loadOptions = (search, loadedOptions, { page }) => {
        return new Promise((resolve, reject) => {
            var searchTextObj = {};
            searchTextObj[searchTextKey] = search;
            dispatch(ApiCallActions.List({
                controller: controller,
                action: action,
                data: {
                    pageSize: 100,
                    pageNumber: page,
                    ...searchTextObj,
                    ...filter,
                },
                showAlertOnError: true,
                onSuccess: ({ data, pagination }) => {
                    const hasMore = general.isNullOrEmpty(pagination) ? false : pagination?.pageCount > pagination?.pageNumber;
                    resolve({
                        options: data.map(f => { f.name = i18next.t(f.name); return f; }),
                        hasMore: hasMore,
                        additional: {
                            page: page + 1,
                        }
                    })
                },
                onError: ({ errorMessage }) => reject(i18next.t(errorMessage))
            }))

        })
    }

    const noOptMsg = () => i18next.t("general.no_records_found");
    const loadingMsg = () => i18next.t("general.loading");


    const getStyles = {
        control: (baseControl) => ({
            ...baseControl,
            borderRadius: 2,
            borderColor: general.isNullOrEmpty(errorMessage) ? "#e4e9f0" : "#f5222e",
            // height: '40px',
            minHeight: '40px',
        }),
        container: (baseContainer) => ({
            ...baseContainer,
            width: '100%',
        })
    }

    return (
        <Form.Item

            label={label}
            validateStatus={general.isNullOrEmpty(errorMessage) ? "" : "error"}
            help={errorMessage}
            {...antdFormItemProps}
        >
            <AsyncPaginate
                isDisabled={disabled}
                cacheUniqs={clearCache}
                isClearable={isClearable}
                getOptionLabel={getOptionLabel}
                onMenuClose={() => setClearCache([general.generateRandomString(10)])}
                debounceTimeout={100}
                placeholder={placeholder}
                styles={getStyles}
                noOptionsMessage={noOptMsg}
                loadingMessage={loadingMsg}
                value={value ?? []}
                loadOptions={loadOptions}
                onChange={onCahngeEvent}
                closeMenuOnSelect={false}
                isMulti={true}
                additional={{
                    page: 1,
                }}
            />
            {rightAction}
        </Form.Item>
    )
}

const areEqual = (prev, next) => {
    return prev.label === next.label
        && prev.placeholder === next.placeholder
        && prev.disabled === next.disabled
        && prev.searchTextKey === next.searchTextKey
        && prev.action === next.action
        && JSON.stringify(prev.filter) === JSON.stringify(next.filter)
        && JSON.stringify(prev.value) === JSON.stringify(next.value)
        && JSON.stringify(prev.loadAndSelectIdList) === JSON.stringify(next.loadAndSelectIdList)
        && prev.errorMessage === next.errorMessage
        && prev.controller === next.controller
        && prev.usei18next === next.usei18next;

}

export default React.memo(FormMultiSelect, areEqual);