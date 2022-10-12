import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Actions as ModalActions } from "redux/modal/reducers"
import { Modal } from 'antd';
import i18next from "i18next";

const ModalFullWidthOverlay = ({ children, isOpen, nodeKey, title,handleOk }) => {
    const dispatch = useDispatch();
    const [isOpenHook, setIsOpenHook] = useState(isOpen);

    useEffect(() => {
        if (!isOpen)
            close();
    }, [isOpen])

    const close = () => {
        setIsOpenHook(false);
        setTimeout(() => {
            dispatch(ModalActions.closeModal({
                nodeKey: nodeKey
            }))
        }, 300);
    }

    return (
        <Modal
            title={i18next.t(title)}
            animation="slideUp"
            visible={isOpenHook}
            onCancel={close}
            width={'100%'}
            onOk={handleOk}
            style={{ top: 20 }} >
            <div style={{ padding: "2rem" }}>
                {children}
            </div>
        </Modal>)
}

export default ModalFullWidthOverlay;


