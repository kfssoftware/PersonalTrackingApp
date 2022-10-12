import { notification } from "antd";
import i18next from "i18next";
import nProgress from "nprogress";
import { call, put, select, takeEvery } from "redux-saga/effects";
import apiService from "services/api/apiService";
import general from "utils/general";
import { ActionTypes, Actions } from "./reducers";


const exampleBaseApiCall = {
    // #region for Api service
    controller: "",
    action: "",
    query: {
        id: 1, val: 2
    },
    method: "", // get, post, put, delete
    data: {}, // for, post, put json body data
    itemId: "",
    // #endregion
    onSuccess: { data: {}, pagination: {} }, // <= call data !! Function
    onError: { data: {}, errorMessage: "", errorMessageTechnical: "" }, // <= call data !! Function
    callback: { data: {}, pagination: {}, success: false, error: false, errorMessage: "", errorMessageTechnical: "" }, // <= call data !! Function && Callback
    showAlertOnError: true,
    showLoading: true, // NProgress or other
}
function* BaseApiCall({ payload }) {
    if (payload?.showLoading) // show loading
        nProgress.start();

    const token = yield select(state => state.auth.token); // get bearer token
    const apiCall = yield call(apiService.makeApiCall, { // make Request
        controller: payload?.controller,
        action: payload?.action,
        query: payload?.query,
        data: payload?.data,
        method: payload?.method,
        itemId: payload?.itemId,
        token,
    });

    // #region run callbacks
    if (apiCall?.success && payload?.onSuccess instanceof Function) // run onSuccess
        yield call(payload.onSuccess, { data: apiCall?.data, pagination: apiCall?.pagination });

    if (apiCall?.error && payload?.onError instanceof Function) // run onErorr
        yield call(payload.onError, { data: apiCall?.data, errorMessage: apiCall?.errorMessage, errorMessageTechnical: apiCall?.errorMessageTechnical });

    if (payload?.callback instanceof Function) // run callback
        yield call(payload.callback, apiCall) //
    // #endregion
    if (apiCall?.error && payload?.showAlertOnError) // show alert on Error
        general.notificationError(apiCall?.errorMessage);

    if (payload?.showLoading) // hide loading
        nProgress.done();
}


const exampleApiCallForNativeGet = {
    controller: "",
    action: "",
    query: {
        id: 1, val: 2
    },
}
function* NativeGetCall({ payload }) {
    yield put(Actions.BaseApiCall({ ...payload, method: "get" }))

}

const exampleApiCallForNativePost = {
    controller: "",
    action: "",
    query: {
        id: 1, val: 2
    },
    data: {},
}
function* NativePostCall({ payload }) {
    yield put(Actions.BaseApiCall({ ...payload, method: "post" }))
}

const exampleApiCallForDetail = {
    controller: "",
    itemId: 0, // item id
}
function* Detail({ payload }) {
    yield put(Actions.BaseApiCall({
        ...payload,
        action: null,
        itemId: payload?.itemId,
        method: "get",
    }))
}

const exampleApiCallForUpdate = {
    controller: "",
    data: {},
    itemId: 0, // item id
}
function* Update({ payload }) {
    yield put(Actions.BaseApiCall({
        ...payload,
        action: payload.action ?? null,
        itemId: payload?.itemId,
        method: "put",
    }))
}

const exampleApiCallForSave = {
    controller: "",
    data: {},
}
function* Save({ payload }) {
    yield put(Actions.BaseApiCall({
        ...payload,
        action: null,
        method: "post",
    }))
}

const exampleApiCallForDelete = {
    controller: "",
    itemId: 0, // item id
}
function* Delete({ payload }) {
    yield put(Actions.BaseApiCall({
        ...payload,
        action: null,
        itemId: payload?.itemId,
        method: "delete",
    }))
}

const exampleApiCallForList = {
    controller: "",
    action: "",
    query: {
    },
}
function* List({ payload }) {
    yield put(Actions.BaseApiCall({
        ...payload,
        method: "post",
    }))
}


const exampleApiCallForUpdateStatus = {
    controller: "",
    itemId: 0, // item id
    status: 1
}
function* UpdateStatus({ payload }) {
    yield put(Actions.BaseApiCall({
        ...payload,
        action: "updateStatus/" + payload?.itemId + "/" + payload?.status,
        data: {
            id: payload?.itemId, status: payload?.status
        },
        method: "put",
        itemId: null
    }))
}



export default [
    takeEvery(ActionTypes.NATIVE_GET, NativeGetCall),
    takeEvery(ActionTypes.NATIVE_POST, NativePostCall),
    takeEvery(ActionTypes.DELETE, Delete),
    takeEvery(ActionTypes.DETAIL, Detail),
    takeEvery(ActionTypes.SAVE, Save),
    takeEvery(ActionTypes.UPDATE, Update),
    takeEvery(ActionTypes.LIST, List),
    takeEvery(ActionTypes.UPDATE_STATUS, UpdateStatus),
    takeEvery(ActionTypes.BASE_API_CALL, BaseApiCall),
];
