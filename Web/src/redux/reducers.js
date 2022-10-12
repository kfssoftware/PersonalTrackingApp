import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import menu from './menu/reducers'
import settings from './settings/reducers'
import * as auth from "./auth/reducers"
import * as root from "./root/reducers"
import * as apiCall from "./apiCall/reducers"
import * as modal from "./modal/reducers"

export default history =>
  combineReducers({
    router: connectRouter(history),
    menu,
    settings,
    auth: auth.reducer,
    root: root.reducer,
    apiCall: apiCall.reducer,
    modal: modal.reducer
  })
