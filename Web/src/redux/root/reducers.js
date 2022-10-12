
import { createReducer, createActions } from "reduxsauce";
import produce from "immer";


const INITIAL_STATE = {
    appIsLoading: true,
    i18nextLoading: true
};

const { Types, Creators } = createActions({
    setRootState: ["payload"],
});

export const ActionTypes = Types;
export const Actions = Creators;

export const reducer = createReducer(INITIAL_STATE, {
    [Types.SET_ROOT_STATE]: produce((draft, { payload }) => ({ ...draft, ...payload })),
});
