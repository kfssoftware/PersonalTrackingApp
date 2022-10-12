import React, { useCallback, useState } from 'react'
import { Button, Tooltip, Badge } from 'antd';
import general from 'utils/general';
import i18next from 'i18next';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { AutoResizer } from 'react-base-table';


const BaseAction = ({
    tooltip,
    iconName,
    iconNode,
    buttonType = "info",
    onClick,
    iconColor,
    color = "default",
    backgroundColor,
    text,
    loading,
    size = "middle", // small, middle, large
    disabled,
    enableFunctionEqualityCheckForMemo = false,
    usei18next,
    badges,
    windowSize,
    noBorder,
    leftBorder,
    rightBorder,

}) => {

    if (windowSize && windowSize < 700)
        text = "";
    const className = `btn btn-sm btn-${buttonType}`;
    const onClickButton = (e) => {
        e.preventDefault()
        if (onClick instanceof Function)
            onClick();
    }


    let IiconStyle = {};
    if (!general.isNullOrEmpty(iconColor))
        IiconStyle.color = iconColor;
    if (!general.isNullOrEmpty(text))
        IiconStyle.marginRight = 5;

    return (
        <>
            {!disabled &&
                <>
                    {!general.isNullOrEmpty(badges) &&
                        <>
                            {!general.isNullOrEmpty(tooltip) &&
                                <Badge count={<ExclamationCircleOutlined style={{ color: '#f5222d', fontWeight: 700 }} />} size="small" style={{ marginRight: "25px", marginLeft: "20px", marginTop: "7px" }}>
                                    <Tooltip placement="bottom" title={tooltip} >
                                        <Button
                                            onClick={onClickButton}
                                            style={{ marginLeft: 3, color: color, borderWidth: noBorder ? 0 : 1 }}
                                            color={backgroundColor}
                                            // shape="circle"
                                            disabled={disabled}
                                            loading={loading}
                                            icon={iconNode ? iconNode : iconName ? <i style={IiconStyle} className={iconName} /> : null}
                                            className={className} size={size} >
                                            {usei18next ? i18next.t(text) : text}

                                        </Button>
                                    </Tooltip>
                                </Badge>
                            }
                            {general.isNullOrEmpty(tooltip) &&
                                <Button
                                    onClick={onClickButton}
                                    style={{ marginLeft: 3, color: color,  borderWidth: noBorder ? 0 : 1}}
                                    color={backgroundColor}
                                    disabled={disabled}
                                    loading={loading}
                                    icon={iconNode ? iconNode : iconName ? <i style={IiconStyle} className={iconName} /> : null}
                                    className={className} size={size} >
                                    {usei18next ? i18next.t(text) : text}
                                </Button>
                            }
                        </>
                    }
                    {general.isNullOrEmpty(badges) &&
                        <>
                            {!general.isNullOrEmpty(tooltip) &&
                                <Tooltip placement="bottom" title={tooltip} >
                                    <Button
                                        onClick={onClickButton}
                                        style={{ marginLeft: 3, color: color,borderWidth: 0, borderRight:'solid',borderLeft:'solid',borderRightColor:!rightBorder ?'transparent' :'#eee' ,borderLeftColor:!leftBorder ?'transparent' :'#eee' }}
                                        color={backgroundColor}
                                        // shape="circle"
                                        disabled={disabled}
                                        loading={loading}
                                        icon={iconNode ? iconNode : iconName ? <i style={IiconStyle} className={iconName} /> : null}
                                        className={className} size={size} >
                                        {usei18next ? i18next.t(text) : text}

                                    </Button>
                                </Tooltip>
                            }
                            {general.isNullOrEmpty(tooltip) &&
                                <Button
                                    onClick={onClickButton}
                                    style={{ marginLeft: 3, color: color,borderWidth: 0,  borderRight:'solid',borderLeft:'solid',borderRightColor:!rightBorder ?'transparent' :'#eee' ,borderLeftColor:!leftBorder ?'transparent' :'#eee' }}
                                    color={backgroundColor}
                                    disabled={disabled}
                                    loading={loading}
                                    icon={iconNode ? iconNode : iconName ? <i style={IiconStyle} className={iconName} /> : null}
                                    className={className} size={size} >
                                    {usei18next ? i18next.t(text) : text}
                                </Button>
                            }
                        </>
                    }
                </>
            }
        </>
    )
}
const areEqual = (prev, next) => {

    if (prev?.enableFunctionEqualityCheckForMemo || next?.enableFunctionEqualityCheckForMemo)
        if (prev.onClick !== next.onClick)
            return false;

    return prev.tooltip === next.tooltip
        && prev.badges === next.badges
        && prev.iconName === next.iconName
        && prev.buttonType === next.buttonType
        && prev.loading === next.loading
        && prev.disabled === next.disabled
        && prev.text == next.text
        && prev.color == next.color
        && prev.windowSize == next.windowSize
        && prev.usei18next === next.usei18next;

}
export default React.memo(BaseAction, areEqual);