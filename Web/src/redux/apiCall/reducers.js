
import { createReducer, createActions } from "reduxsauce";

const INITIAL_STATE = {
};

const { Types, Creators } = createActions({
    NativeGet: ["payload"],
    BaseApiCall: ["payload"],
    NativePost: ["payload"],
    Detail: ["payload"],
    Save: ["payload"],
    Delete: ["payload"],
    Update: ["payload"],
    UpdateStatus: ["payload"],
    List: ["payload"],
});

export const ActionTypes = Types;
export const Actions = Creators;

export const reducer = createReducer(INITIAL_STATE, {

});
