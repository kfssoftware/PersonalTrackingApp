import React, { useState, useEffect } from 'react'
import { AutoComplete, Form, Input, Select } from 'antd'
import i18next from 'i18next'
import { AsyncPaginate } from 'react-select-async-paginate'
import { useDispatch } from 'react-redux'
import { Actions as ApiCallActions } from 'redux/apiCall/reducers'
import general from 'utils/general';
import { FormSelect } from 'components/high-level/form'


const FormSelectInput = ({
  label,
  placeholder = i18next.t('form.select.placeholder'),
  prefix,
  suffix,
  errorMessage,
  errorMessageSelect,
  searchTextKey = 'searchText',
  onChange,
  antdFormItemProps = {},
  filter,
  controller = 'user',
  action = 'dropdown',
  show = true,
  isClearable = true,
  value,
  selectedName,
  onChangeInput,
  selectedId,
  nameKey = "name",
  antdInputProps,
  noRecordText = "general.no_records_found",
  getOptionLabel = (option) => option?.name,
  valueKey = "value",
  disabled
}) => {
  const dispatch = useDispatch()
  const [first, setFirst] = useState([]);
  const [clearCache, setClearCache] = useState([general.generateRandomString(10)]);
  const [isMobile, setIsMobile] = useState(false)


  useEffect(() => {
    if (window.innerWidth <= 767) setIsMobile(true)
  }, [])

  const onChangeEvent = e => {
    if (onChange instanceof Function) onChange(e)
  }
  const onChangeInputEvent = (e) => {
    if (onChangeInput instanceof Function)
      onChangeInput(e.target.value);
  }

  const loadOptions = (search, { page }) => {
    return new Promise((resolve, reject) => {
      var searchTextObj = {}
      searchTextObj[searchTextKey] = search
      if (show) {
        dispatch(
          ApiCallActions.List({
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
                  e.name = i18next.t(e.name);
                  return e;
                }),
                hasMore: hasMore,
                additional: {
                  page: page + 1
                }
              })
            },
            onError: ({ errorMessageSelect }) => reject(i18next.t(errorMessageSelect))
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
      borderColor: general.isNullOrEmpty(errorMessageSelect) ? "#e4e9f0" : "#f5222e",
      height: '40px',
      minHeight: '40px',
      padding: isMobile === true && 0,
      width: isMobile === true ? '115px' : '125px',
    }),
    container: (baseContainer) => ({
      ...baseContainer,
    })
  }

  let val = { name: "asd", value: 1 };

  val[nameKey] = selectedName;
  val[valueKey] = selectedId;

  return (
    <Form.Item
      label={label}
      style={{ display: "flex" }}

      validateStatus={general.isNullOrEmpty(errorMessage, errorMessageSelect) ? "" : "error"}
      help={[errorMessage, errorMessageSelect]}
      {...antdFormItemProps}

    >
      <Input
        prefix={prefix}
        suffix={suffix}
        allowClear
        value={value}
        disabled={disabled}
        onChange={onChangeInputEvent}
        placeholder={i18next.t(placeholder)}
        {...antdInputProps}
        size="large"
      />

      <AsyncPaginate
        isDisabled={disabled}
        cacheUniqs={clearCache}
        onChange={onChangeEvent}
        size="large"
        styles={getStyles}
        value={val}
        placeholder={first}
        loadOptions={loadOptions}
        loadingMsg={loadingMsg}
        noOptionsMessage={noOptMsg}
        onMenuClose={() => setClearCache([general.generateRandomString(10)])}
        getOptionLabel={getOptionLabel}
        additional={{
          page: 1,
        }}
      />

    </Form.Item>
  )
}

const areEqual = (prev, next) => {
  return prev.label === next.label
    && prev.placeholder === next.placeholder
    && prev.errorMessage === next.errorMessage
    && prev.disabled === next.disabled
    && prev.noRecordText === next.noRecordText
    && prev.selectedId === next.selectedId
    && prev.searchTextKey === next.searchTextKey
    && prev.action === next.action
    && JSON.stringify(prev.filter) === JSON.stringify(next.filter)
    && prev.controller === next.controller
    && prev.show === next.show
    && prev.value == next.value;
}
export default React.memo(FormSelectInput, areEqual)
