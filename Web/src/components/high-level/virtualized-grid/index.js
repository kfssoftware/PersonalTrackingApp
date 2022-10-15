import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  CloseOutlined,
  FilterFilled,
  FilterOutlined,
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { Input, Pagination, ConfigProvider } from 'antd'
import { useDispatch } from 'react-redux'
import BaseTable, { AutoResizer } from 'react-base-table'
import { Actions as ApiCallActions } from 'redux/apiCall/reducers'
import i18next from 'i18next'
import general from 'utils/general'
import GridAction from './grid-action'
import useOnEntityCreated from 'infrastructure/event-bus/hooks/use-on-entity-created'
import useOnEntityDeleted from 'infrastructure/event-bus/hooks/use-on-entity-deleted'
import useOnEntityUpdated from 'infrastructure/event-bus/hooks/use-on-entity-updated'
import useRefState from '../../../utils/use-ref-state'
import { useParams } from 'react-router-dom'
import en from 'antd/lib/locale/en_US';
import tr from 'antd/lib/locale/tr_TR';

const VirtualizedGrid = ({
  controller = 'user',
  action = 'list',
  headerTitle,
  sort,
  filterComponent,
  filter,
  columns,
  estimatedRowHeight = 40,
  headerActions = [],
  toggleFilter,
  filterIsOpen,
  ısInput,
  refreshIsShow = true,
  showHeader = true,
  filterIsShow = true,
  onDoubleRowClick,
  useEventBus = false,
  entityTypeForEventBus = -1,
  updateItemKey = { id: 0, key: '123' },
  searchTextKey = 'search',
  minWidth
}) => {

  var locale;
  if (global?.userInfo?.languageId == 1) locale = tr;
  else if (global?.userInfo?.languageId == 2) locale = en;
  else locale = tr;

  const dispatch = useDispatch()
  const id = useParams();

  const didMountRef = useRef(false)
  const baseTableRef = useRef(null)
  // const [paging, setPaging] = useState({ page: 1, pageSize: 10 });
  const [data, dataRef, setData] = useRefState({ totalCount: 0, data: [] })
  const [loading, setLoading] = useState(true)
  const { innerHeight: windowHeight } = window
  const [tableWidth, setTableWidth] = useState(0)
  const [windowSize, setWindowSize] = useState(0)
  const [searchTimer, setSearchTimer] = useState(null)
  const [pagingAndSearch, setPagingAndSearch] = useState({ page: 1, pageSize: 10, search: '' })
  const [sortBy, setSortBy] = useState(sort ?? { key: 'id', order: 'desc' })

  useEffect(() => {
    if (didMountRef.current) loadData()
  }, [pagingAndSearch])

  useEffect(() => {
    if (didMountRef.current) loadData()
  }, [sortBy])

  useEffect(() => {
    if (didMountRef.current) setPagingAndSearch(curr => ({ ...curr, page: 1 }))
  }, [JSON.stringify(filter)])

  const scrollToRow = ({ index }) => {
    if (baseTableRef.current !== null && baseTableRef.current !== undefined) {
      baseTableRef.current.scrollToRow(index, 'start')
    }
  }

  const reloadRow = ({ index }) => {
    if (baseTableRef.current !== null && baseTableRef.current !== undefined) {
      baseTableRef.current.resetAfterRowIndex(index)
    }
  }

  const toggleReload = useCallback(() => {
    if (didMountRef.current) loadData()
  }, [pagingAndSearch])

  const updateEntity = useCallback(({ entityId }) => {
    if (general.isNullOrEmpty(entityId)) return
    if (entityId === 0) return
    if (!didMountRef.current) return

    const data = JSON.parse(localStorage.getItem('jobs'));
    if (data) {
      setTempId({ list: data })
      setData({ totalCount: data.length, data })
      setLoading(false)
      setTimeout(() => {
        if (data?.length > 0) scrollToRow({ index: 0 })
      }, 200)
    }
  }, [])

  useEffect(() => {
    updateEntity({ entityId: updateItemKey?.id })
  }, [updateItemKey?.key])

  const onEntityChangedEventReceivedFromEventBus = useCallback(
    ({ entityType, entityId }) => {
      if (useEventBus && entityType == entityTypeForEventBus) updateEntity({ entityId })
    },
    [useEventBus, entityTypeForEventBus],
  )

  useOnEntityCreated(entityTypeForEventBus, null, onEntityChangedEventReceivedFromEventBus)
  useOnEntityDeleted(entityTypeForEventBus, null, onEntityChangedEventReceivedFromEventBus)
  useOnEntityUpdated(entityTypeForEventBus, null, onEntityChangedEventReceivedFromEventBus)

  useEffect(() => {
    loadData()
    if (!didMountRef.current) didMountRef.current = true
  }, [])

  const sort_by_function = (field, reverse, primer) => {
    const key = primer ?
      function (x) {
        return primer(x[field])
      } :
      function (x) {
        return x[field]
      };
    reverse = !reverse ? 1 : -1;
    return function (a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
  }

  const setTempId = useCallback(({ obj, list }) => {
    if (obj instanceof Object) obj.tmpIdForGrid = general.generateRandomString(5)
    if (list instanceof Array)
      list.map(item => (item.tmpIdForGrid = general.generateRandomString(5)))
  }, [])

  const loadData = () => {
    setLoading(true)
    var searchTextObj = {}
    searchTextObj[searchTextKey] = pagingAndSearch?.searchText
    let data = JSON.parse(localStorage.getItem('jobs'));
    if (filter?.priority) {
      data = data.filter(res => {
        return (JSON.stringify(res).toLocaleLowerCase()).match(filter?.priority.toLocaleLowerCase());
      });
    }
    if (filter?.name) {
      var search = new RegExp(filter?.name, 'i');
      data = data.filter(item => search.test(item.name));
    }
    // if (searchTextObj)
    //   data.filter(item => item.name != id);
    if (sortBy)
      data && data.sort(sort_by_function(sortBy.key, sortBy.order == "asc" ? false : true, (a) => a));

    if (data) {
      setTempId({ list: data })
      setData({ totalCount: data.length, data })
      setLoading(false)
      setTimeout(() => {
        if (data?.length > 0) scrollToRow({ index: 0 })
      }, 200)
    }
  }

  const onResize = useCallback(({ width }) => {
    setWindowSize(width)
    if (width < minWidth) {
      setTableWidth(minWidth)
    } else {
      setTableWidth(width)
    }
  }, [minWidth])

  const onChangePage = useCallback((page, pageSize) => {
    setPagingAndSearch(curr => ({ ...curr, page, pageSize }))
  }, [])

  const onChangeSearchText = useCallback(
    e => {
      const val = e.target?.value
      clearTimeout(searchTimer)
      setSearchTimer(
        setTimeout(() => {
          setPagingAndSearch(curr => ({ ...curr, searchText: val, page: 1 }))
        }, 650),
      )
    },
    [searchTimer],
  )

  const useDateConvertRenderer = useCallback(
    ({ cellData, rowData }) => (
      <div className={general.getCellRendererClassName(rowData)}>
        {general.apiDateFormatToUserFormat(cellData, true)}
      </div>
    ),
    [],
  )

  const useI18nextRenderer = useCallback(
    ({ cellData, rowData }) => (
      <div className={general.getCellRendererClassName(rowData)}>{i18next.t(cellData)}</div>
    ),
    [],
  )

  const generalRenderer = useCallback(({ cellData, rowData, cellRenderer }) => {
    if (!cellRenderer)
      return <div className={general.getCellRendererClassName(rowData)}>{cellData}</div>
    else return cellRenderer
  }, [])

  const onColumnSort = useCallback(
    sortBy => {
      setSortBy(sortBy)
    },
    [sortBy],
  )

  const useColumns = columns?.filter(x => !x.hide).map(col => ({
    flexGrow: 1,
    width: 100,
    ...col,
    ...(col?.usei18next ? { cellRenderer: useI18nextRenderer } : {}),
    ...(col?.useDateConvert ? { cellRenderer: useDateConvertRenderer } : {}),
    ...(!col?.usei18next && !col?.useDateConvert && !col?.cellRenderer
      ? { cellRenderer: generalRenderer }
      : {}),
  }))

  const rowEventHandlers = {
    onDoubleClick: row => {
      if (onDoubleRowClick != undefined && onDoubleRowClick instanceof Function) {
        onDoubleRowClick(row.rowData)
      }
    },
  }

  return (
    <div>
      <div className="row">
        <div className="col-12 col-md-12">
          <div className="card">
            {
              showHeader &&
              <>
                <div className="card-header card-header-flex align-items-center" style={{}}>
                  <div
                    style={{ justifyContent: 'space-between' }}
                    className="d-flex flex-row align-items-center"              >
                    <h6 className="mb-0 mr-3 font-size-16 text-nowrap" style={{ marginRight: '20px' }}>
                      <strong>{headerTitle}</strong>
                    </h6>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {filterIsShow && (
                      <GridAction
                        text={filterIsOpen ? "Close Filter" : "Filter"}
                        tooltip={filterIsOpen ? "Close Filter" : "Filter"}
                        enableFunctionEqualityCheckForMemo
                        buttonType="light"
                        rightBorder
                        iconNode={filterIsOpen ? <CloseOutlined /> : <FilterOutlined />}
                        onClick={toggleFilter}
                        windowSize={windowSize}
                      />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      {refreshIsShow && (
                        <GridAction
                          text={"Refresh"}
                          tooltip={"Refresh"}
                          enableFunctionEqualityCheckForMemo
                          buttonType="warning"
                          iconNode={<SyncOutlined />}
                          onClick={toggleReload}
                          noBorder
                          windowSize={windowSize}
                        />
                      )}
                    </div>
                    {headerActions
                      ?.filter(x => x.show)
                      ?.map((action, index) => (
                        <div key={index}>
                          <GridAction
                            enableFunctionEqualityCheckForMemo
                            windowSize={windowSize}
                            leftBorder
                            {...action}
                          />
                        </div>
                      ))}
                    {filterIsShow && (
                      <div style={{ flexDirection: 'row' }}>
                        <Input
                          onChange={onChangeSearchText}
                          className="mb-0 mr-2 font-size-18"
                          prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                          allowClear
                          placeholder="Search"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            }

            {filterIsOpen && filterComponent}
            <div className="card-body" style={{ width: '100%', padding: '0px', overflow: "hidden", overflowX: windowSize > minWidth ? "hidden" : "auto", overflowY: 'hidden' }}>
              <AutoResizer onResize={onResize}>{({ width, height }) => <div></div>}</AutoResizer>
              <BaseTable
                ref={baseTableRef}
                width={tableWidth}
                estimatedRowHeight={estimatedRowHeight}
                height={200}
                lineHeight={200}
                maxHeight={windowHeight * 0.65}
                columns={useColumns}
                onColumnSort={onColumnSort}
                sortBy={sortBy}
                data={data.data}
                rowEventHandlers={rowEventHandlers}
              />
            </div>
            <div
              style={{ padding: 10, justifyContent: 'space-between', alignItems: 'center' }}
              className="d-flex card-header flex-row align-items-center card-responsive"
            >
              <p style={{ margin: 0 }}>
                {"Total Record Count"} {data?.totalCount}
              </p>
              <ConfigProvider locale={locale} >
                <Pagination
                  pageSize={pagingAndSearch.pageSize}
                  showSizeChanger
                  onChange={onChangePage}
                  responsive={true}
                  current={pagingAndSearch.page}
                  total={data.totalCount}
                />
              </ConfigProvider >
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VirtualizedGrid
