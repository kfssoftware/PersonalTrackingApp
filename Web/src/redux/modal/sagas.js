import { put, select, takeEvery } from "redux-saga/effects";
import general from "utils/general";
import { ActionTypes, Actions } from "./reducers";



const example = {
    type: "MODAL_TYPE",
    modalProps: { onCreate: () => { } }

}

function* openModal({ payload }) {
    const currentModals = yield select(state => state.modal.modals);
    const newModals = [...currentModals];
    newModals.push({
        type: payload?.type,
        nodeKey: general.generateRandomString(15),
        modalProps: payload?.modalProps
    })
    yield put(Actions.setModalState({ modals: newModals }));
}

function* closeModal({ payload }) {
    const currentModals = yield select(state => state.modal.modals);
    const newModals = [...currentModals.filter(x => x.nodeKey !== payload?.nodeKey)];
    yield put(Actions.setModalState({ modals: newModals }));
}

export default [
    takeEvery(ActionTypes.OPEN_MODAL, openModal),
    takeEvery(ActionTypes.CLOSE_MODAL, closeModal),
];
