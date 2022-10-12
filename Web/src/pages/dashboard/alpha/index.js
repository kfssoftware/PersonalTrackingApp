import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Actions as ApiCallActions } from "redux/apiCall/reducers"
import { Actions as ModalActions } from "redux/modal/reducers"
import GridActions from "./grid-actions";
import { Helmet } from 'react-helmet'
import { Tag } from 'antd'
import VirtualizedGrid from "components/high-level/virtualized-grid"
import general from 'utils/general';
import GridSwitchAction from 'components/high-level/virtualized-grid/grid-switch-action';
import { StatusEnum } from "utils/enums";
import ModalTypes from 'utils/modal-types';
import i18next from 'i18next';
import { PlusOutlined } from '@ant-design/icons';
import Filter from './filter';
import { EntityTypeEnum } from 'utils/enums/entity-type-enum';
import EventBus from 'infrastructure/event-bus/event-bus';

const JobList = ({ }) => {
    const dispatch = useDispatch();
    const [filterIsOpen, setFilterIsOpen] = useState(false);
    const [filter, setFilter] = useState({});

    const deleteItem = useCallback(({ id }) => {
        const oldJobs = JSON.parse(localStorage.getItem('jobs'));
        let newJobs = oldJobs.filter(item => item.id != id);
        localStorage.setItem('jobs', JSON.stringify(newJobs));
        EventBus.sc.onEntityDeleted({ entityType: EntityTypeEnum.Job, entityId: id });
        general.messageSuccess("Delete Success");
    }, []);

    const editItem = useCallback(({ id }) => {
        dispatch(ModalActions.openModal({
            type: ModalTypes.JOB_FORM,
            modalProps: {
                id
            }
        }))
    }, []);

    const newItem = useCallback(() => {
        dispatch(ModalActions.openModal({
            type: ModalTypes.JOB_FORM,
            modalProps: {
            }
        }))
    }, []);

    const actionsCellRenderer = useCallback(({ rowData }) => {
        return <div className={general.getCellRendererClassName(rowData)}><GridActions
            editItem={editItem}
            deleteItem={deleteItem}
            rowData={rowData}
        /></div>
    }, [])

    const priorityCellRenderer = useCallback(({ rowData }) => {
        return <div className='rowStyle rowStyle0'><Tag color={rowData.priorityColor}>{rowData.priority}</Tag></div>
    }, [])

    const clearFilter = useCallback(() => {
        setFilter({
        })
    }, []);

    const toggleFilter = useCallback(() => {
        setFilterIsOpen(curr => !curr);
    }, []);

    const imageCellRenderer = useCallback(({ rowData }) => {
        var file = "";
        if (!general.isNullOrEmpty(rowData?.imageUrl)) {
            file = JSON.parse(rowData.imageUrl);
            if (file?.length > 0)
                file = file[0]?.downloadUrl;
            else
                file = undefined;
        }
        if (general.isNullOrEmpty(file))
            file = require("assets/logo.png");
        return (
            <div className={general.getCellRendererClassName(rowData)}>
                <img src={file} style={{ width: 50, height: 50, objectFit: 'contain', marginTop: 5, marginBottom: 5 }} />
            </div>
        )
    }, [])

    return (
        <>
            <Helmet title={"Jobs"} />
            <VirtualizedGrid
                minWidth={1100}
                useEventBus={true}
                entityTypeForEventBus={EntityTypeEnum.Job}
                filter={filter}
                toggleFilter={toggleFilter}
                filterIsOpen={filterIsOpen}
                filterComponent={<Filter toggleFilter={toggleFilter} filterData={filter} saveFilter={setFilter} clearFilter={clearFilter} />}
                headerTitle={"Job List"}
                headerActions={[
                    {
                        show: true,
                        text: "Add",
                        iconNode: <PlusOutlined />,
                        buttonType: "success",
                        onClick: newItem,
                        tooltip: "Add"
                    }
                ]}
                estimatedRowHeight={36}
                controller="job"
                columns={
                    [
                        {
                            key: 'name',
                            title: "Name",
                            dataKey: 'name',
                            sortable: true,
                        },
                        {
                            key: 'priority',
                            title: "Priority",
                            dataKey: 'priority',
                            sortable: true,
                            cellRenderer: priorityCellRenderer
                        },
                        {
                            key: 'none',
                            title: "Action",
                            dataKey: 'none',
                            flexGrow: null,
                            cellRenderer: actionsCellRenderer
                        },
                    ]
                }
            />
        </>
    )
}
export default JobList;