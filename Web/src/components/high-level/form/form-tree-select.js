import { AutoComplete, Form, TreeSelect } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import general from 'utils/general';
import { AsyncPaginate } from 'react-select-async-paginate';
import { useDispatch } from 'react-redux';
import { Actions as ApiCallActions } from "redux/apiCall/reducers";
import i18next from 'i18next';


const FormTreeSelect = ({
    label,
    placeholder = "Choose",
    value,
    errorMessage,
    antdFormItemProps = {},
    onChange,
    onChangeItem,
    onSelect,
    controller = "user",
    disabled,
    action = "dropdown",
    filter,
    noRecordText = "general.no_records_found",
    isTranslate = true,
    treeCheckable = false
}) => {

    const dispatch = useDispatch()
    const [clearCache, setClearCache] = useState([general.generateRandomString(10)]);
    const [treeList, setTreeList] = useState([])


    const onCahngeEvent = (e) => {
        if (onChange instanceof Function)
            onChange(e);
        if (onChangeItem instanceof Function) {
            var item = treeList?.map(x => {
                if (x?.value === e)
                    return x;
                var item = x?.children?.find(y => y?.value == e);
                if (e)
                    return item;
            })?.filter(x => x != undefined)

            var item = item?.length > 0 ? item[0] : undefined;

            onChangeItem(item);
        }
    }

    const onChangeSelect = (key, e) => {
        if (onSelect instanceof Function)
            onSelect(e);
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
    const translateChildren = useCallback((children) => {
        return children?.map(x => {
            x.title = i18next.t(x.title)
            x.children = translateChildren(x.children)
            return x;
        });
    }, [])



    useEffect(() => {
        dispatch(
            ApiCallActions.NativePost({
                controller: controller,
                action: action,
                data: { ...filter },
                showLoading: true,
                showAlertOnError: true,
                onSuccess: ({ data }) => {
                    setTreeList(data?.map(x => {
                        if (isTranslate) {
                            x.title = i18next.t(x.title)
                            x.children = translateChildren(x.children)
                        }
                        return x;
                    }))
                },
            }),
        )
    }, [filter])

    return (
        <>
            <h6 style={{ fontWeight: 500 }}>{label}</h6>
            <Form.Item
                validateStatus={general.isNullOrEmpty(errorMessage) ? "" : "error"}
                help={errorMessage}
                {...antdFormItemProps}
            >
                <TreeSelect
                    style={getStyles}
                    value={value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeList}
                    placeholder={placeholder}
                    onChange={onCahngeEvent}
                    showCheckedStrategy={TreeSelect.SHOW_ALL}
                    //  onSelect={onChangeSelect}
                    onSelect={(selectedKeys, e) => onChangeSelect(selectedKeys, e)}
                    maxTagCount={10}
                    treeCheckable={treeCheckable}
                    size="large"
                    allowClear={true}
                    showSearch
                    filterTreeNode={(search, item) => {
                        return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0
                    }}
                    disabled={disabled}
                />

            </Form.Item>
        </>
    )
}

const areEqual = (prev, next) => {
    return prev.label === next.label
        && prev.placeholder === next.placeholder
        && prev.noRecordText === next.noRecordText
        && prev.disabled === next.disabled
        && prev.action === next.action
        && JSON.stringify(prev.filter) === JSON.stringify(next.filter)
        && prev.controller === next.controller
        && prev.errorMessage === next.errorMessage
        && prev.value == next.value
}

export default React.memo(FormTreeSelect, areEqual);