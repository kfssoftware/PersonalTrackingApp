import { DownloadOutlined, createFromIconfontCN } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { Button, Switch, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'
import general from 'utils/general';
import i18next from 'i18next';

const GridSwitchAction = ({
    checked,
    id,
    onChange,
    tmpIdForGrid,
    checkedChildren = "general.active",
    unCheckedChildren = "general.passive",
    disabled
}) => {
    const [checkedHook, setCheckedHook] = useState(checked);

    useEffect(() => {
        setCheckedHook(checked);
    }, [checked, tmpIdForGrid]);

    const onChangeX = (chckd) => {
        setCheckedHook(chckd);
        if (onChange instanceof Function)
            setTimeout(() => {
                onChange({ id, checked: chckd });
            }, 50);
    }

    return (
        <Switch
            checkedChildren={i18next.t(checkedChildren)}
            unCheckedChildren={i18next.t(unCheckedChildren)}
            className="component-col mr-2" onChange={onChangeX} checked={checkedHook}
            disabled={disabled}
            size="small"
        />
    )
}
const areEqual = (prev, next) => {
    return prev.checked === next.checked
        && prev.tmpIdForGrid === next.tmpIdForGrid
        && prev.disabled === next.disabled

}
export default React.memo(GridSwitchAction, areEqual);