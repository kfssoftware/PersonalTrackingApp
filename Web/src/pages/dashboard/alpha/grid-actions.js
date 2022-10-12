import React, { useCallback } from "react";
import GridAction from "components/high-level/virtualized-grid/grid-action";
import GridPopConfirmAction from "components/high-level/virtualized-grid/grid-popconfirm-action";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import i18next from 'i18next';
import general from 'utils/general';

const GridActions = ({ rowData, deleteItem, editItem }) => {

    const onClickEditItem = useCallback(() => {
        if (editItem instanceof Function)
            editItem({ id: rowData?.id });
    }, [editItem])

    const onClickDeleteItem = useCallback(() => {
        if (deleteItem instanceof Function)
            deleteItem({ id: rowData?.id });
    }, [deleteItem])

    return <div style={{ padding: 2 }}>
        <GridAction
            iconNode={<EditOutlined />}
            buttonType="info"
            onClick={onClickEditItem}
            tooltip="Edit"
        />
        <GridPopConfirmAction
            actionProps={{
                buttonType: "danger",
                iconNode: <DeleteOutlined />,
                tooltip: "Delete"
            }}
            onClickYes={onClickDeleteItem}
        />
    </div>

}

const areEqual = (prev, next) => {
    return prev.rowData?.id === next.rowData?.id
        && prev.rowData?.tmpIdForGrid === next.rowData?.tmpIdForGrid;
}

export default React.memo(GridActions, areEqual);