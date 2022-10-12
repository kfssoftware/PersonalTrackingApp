import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Actions as ModalActions } from "redux/modal/reducers"
import JobFormModal from "modals/job/job-form";
import ModalTypes from "utils/modal-types";
import "components/high-level/rodal/rodal.css";
import { useHistory } from "react-router-dom";

const ModalRenderContainer = ({ }) => {
    const dispatch = useDispatch();
    const modals = useSelector(state => state.modal.modals);
    const history = useHistory()
    useEffect(() => {
        return history.listen((location) => {
            dispatch(ModalActions.setModalState({ modals: [] }))
        })
    }, [history])

    return (
        <div>
            {modals?.map(item => <div key={item?.nodeKey}>
                {item.type === ModalTypes.JOB_FORM &&
                    <JobFormModal key={item?.nodeKey + "rM"} nodeKey={item?.nodeKey} {...item.modalProps} />
                }
            </div>)}
        </div>)
}

export default ModalRenderContainer;