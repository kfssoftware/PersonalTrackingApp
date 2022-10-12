import { AutoComplete, Form } from 'antd';
import React, { useState } from 'react';
import general from 'utils/general';
import { AsyncPaginate } from 'react-select-async-paginate';
import { useDispatch } from 'react-redux';
import { Actions as ApiCallActions } from "redux/apiCall/reducers";
import i18next from 'i18next';


const FormSelect = ({
    label,
    placeholder = "Choose",
    selectedId,
    selectedName,
    errorMessage,
    antdFormItemProps = {},
    onChange,
    controller = "user",
    disabled,
    action = "dropdown",
    filter,
    searchTextKey = "search",
    isClearable = true,
    rightAction,
    getOptionLabel = (option) => option?.name,
    nameKey = "name",
    valueKey = "value",
    noRecordText = "general.no_records_found",
    show = true,
    isTranslate = true
}) => {
    const dispatch = useDispatch()
    const [clearCache, setClearCache] = useState([general.generateRandomString(10)]);

    const onCahngeEvent = (e) => {
        if (onChange instanceof Function)
            onChange(e);
    }

    const loadOptions = (search, loadedOptions, { page }) => {
        return new Promise((resolve, reject) => {
            var searchTextObj = {};
            searchTextObj[searchTextKey] = search;
            if (show) {
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
                            options: data.map((e) => {
                                e.name = isTranslate ? e.name : e.name;
                                return e;
                            }),
                            hasMore: hasMore,
                            additional: {
                                page: page + 1,
                            }
                        })
                    },
                    onError: ({ errorMessage }) => reject(i18next.t(errorMessage))
                }))
            } else {
                resolve({
                    options: []
                })
            }
        })
    }

    const noOptMsg = () => i18next.t(noRecordText);
    const loadingMsg = () => i18next.t("general.loading");

    const getStyles = {
        control: (baseControl) => ({
            ...baseControl,
            borderRadius: 2,
            borderColor: general.isNullOrEmpty(errorMessage) ? "#e4e9f0" : "#f5222e",
            height: '40px',
            minHeight: '40px',
        }),
        container: (baseContainer) => ({
            ...baseContainer,
            width: '100%',
        })
    }
    let val = {}
    val[nameKey] = selectedName;
    val[valueKey] = selectedId;
    return (
        <>
            <h6 style={{ fontWeight: 500 }}>{label}</h6>
            <Form.Item
                validateStatus={general.isNullOrEmpty(errorMessage) ? "" : "error"}
                help={errorMessage}
                {...antdFormItemProps}
            >
                <AsyncPaginate
                    cacheUniqs={clearCache}
                    isClearable={isClearable}
                    getOptionLabel={getOptionLabel}
                    onMenuClose={() => setClearCache([general.generateRandomString(10)])}
                    debounceTimeout={100}
                    placeholder={placeholder}
                    isDisabled={disabled}
                    styles={getStyles}
                    noOptionsMessage={noOptMsg}
                    loadingMessage={loadingMsg}
                    value={(selectedId ? val : null)}
                    loadOptions={loadOptions}
                    onChange={onCahngeEvent}
                    additional={{
                        page: 1,
                    }}
                />
                {rightAction}
            </Form.Item>
        </>
    )
}

const areEqual = (prev, next) => {
    return prev.label === next.label
        && prev.placeholder === next.placeholder
        && prev.noRecordText === next.noRecordText
        && prev.selectedId === next.selectedId
        && prev.searchTextKey === next.searchTextKey
        && prev.disabled === next.disabled
        && prev.action === next.action
        && JSON.stringify(prev.filter) === JSON.stringify(next.filter)
        && prev.controller === next.controller
        && prev.selectedName === next.selectedName
        && prev.errorMessage === next.errorMessage
        && prev.value == next.value
        && prev.show === next.show;
}

export default React.memo(FormSelect, areEqual);