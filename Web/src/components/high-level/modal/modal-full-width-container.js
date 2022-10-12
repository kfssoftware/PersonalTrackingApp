import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Actions as ModalActions } from "redux/modal/reducers"
import Rodal from "../rodal/rodal";

const ModalFullWidthContainer = ({ children, isOpen, nodeKey }) => {
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

    return (<Rodal animation="slideUp" visible={isOpenHook} onClose={() => { }} >
        <div style={{ padding: "2rem" }}>
            {children}
        </div>
    </Rodal>)
}

export default ModalFullWidthContainer;
