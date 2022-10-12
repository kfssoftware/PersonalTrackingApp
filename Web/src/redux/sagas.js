import { all } from 'redux-saga/effects'
import menu from './menu/sagas'
import settings from './settings/sagas'
import auth from "./auth/sagas"
import apiCall from "./apiCall/sagas"
import modal from "./modal/sagas"

export default function* rootSaga() {
  yield all([
    menu(),
    settings(),
    ...auth,
    ...apiCall,
    ...modal
  ])
}
