
import { createReducer, createActions } from "reduxsauce";
import produce from "immer";


const INITIAL_STATE = {
    modals: []
};

const { Types, Creators } = createActions({
    setModalState: ["payload"],
    openModal: ["payload"],
    closeModal: ["payload"]
});

export const ActionTypes = Types;
export const Actions = Creators;

export const reducer = createReducer(INITIAL_STATE, {
    [Types.SET_MODAL_STATE]: produce((draft, { payload }) => ({ ...draft, ...payload })),
});
