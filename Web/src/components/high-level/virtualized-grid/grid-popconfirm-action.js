import React from "react"
import { Popconfirm } from "antd";
import GridAction from "./grid-action";
import i18next from "i18next";
import { putResolve } from "redux-saga/effects";

const GridPopConfirmAction = ({
    //grid action component props
    actionProps = {
        tooltip: null,
        iconName: null,
        buttonType: null,
        iconColor: null,
        backgroundColor: null,
        text: null,
        iconNode: null,
    },
    //

    onClickYes,
    onClickNo,
    confirmationText = "Are you sure?",
    yesButtonText = "Yes",
    noButtonText = "No",
    disabled,
    enableCheckEqualityOfOnClickYes = false

}) => {

    const clickYes = () => {
        if (onClickYes instanceof Function)
            onClickYes();
    }

    const clickNo = () => {
        if (onClickNo instanceof Function)
            onClickNo();
    }

    return (
        <Popconfirm
            title={confirmationText}
            onConfirm={clickYes}
            onCancel={clickNo}
            okType="danger"
            okText={yesButtonText}
            cancelText={noButtonText}
            disabled={disabled}
        >
            <GridAction {...actionProps} />
        </Popconfirm>
    )
}

const areEqual = (prev, next) => {
    if (prev.enableCheckEqualityOfOnClickYes && prev.onClickYes !== next.onClickYes)
        return false;
    return prev.confirmationText === next.confirmationText
        && prev.yesButtonText === next.yesButtonText
        && prev.noButtonText === next.noButtonText
        && prev.disabled === next.disabled
        && prev?.actionProps?.disabled === next?.actionProps?.disabled

        // && JSON.stringify(prev.actionProps) === JSON.stringify(next.actionProps)
}

export default React.memo(GridPopConfirmAction, areEqual);