import 'antd/lib/style/index.less' // antd core styles
import './components/kit/vendors/antd/themes/default.less' // default theme antd components
import './components/kit/vendors/antd/themes/dark.less' // dark theme antd components
import './global.scss' // app & third-party component styles
import 'react-base-table/styles.css'
import moment from 'moment';
import 'moment/locale/tr';
import locale from 'antd/lib/locale/en_US';
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { createHashHistory } from 'history'
import { legacy_createStore as createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
// import { logger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'

import LoadApp from 'load-app'
import reducers from './redux/reducers'
import sagas from './redux/sagas'
import Router from './router'
import * as serviceWorker from './serviceWorker'
// mocking api
import { ConfigProvider } from 'antd'
import general from 'utils/general'
import "assets/css/leaflet.css"

// middlewared
const history = createHashHistory()
const sagaMiddleware = createSagaMiddleware()
const routeMiddleware = routerMiddleware(history)
const middlewares = [sagaMiddleware, routeMiddleware]
// if (env.NODE_ENV === 'development') {
//   middlewares.push(logger)
// }
const queryParams = new URLSearchParams(window.location.search);
const token = queryParams.get('set_token');
if (!general.isNullOrEmpty(token))
  localStorage.setItem("token", token);

global.roles = new Set();
const store = createStore(reducers(history), compose(applyMiddleware(...middlewares)))
sagaMiddleware.run(sagas)
ReactDOM.render(
    <Provider store={store}>
      <LoadApp />
      <ConfigProvider locale={locale}>
        <Router history={history} />
      </ConfigProvider>
    </Provider>,
  document.getElementById('root'),
)

serviceWorker.unregister()
export { store, history }
