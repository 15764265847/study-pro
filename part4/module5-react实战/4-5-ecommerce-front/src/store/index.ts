import { applyMiddleware, createStore } from "redux";
import { createHashHistory } from 'history'
import createSageMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'

import createRootReducer from "./recuders";
import { routerMiddleware } from "connected-react-router";
import rootSage from "./sagas";

export const history = createHashHistory()

const sagaMidleware = createSageMiddleware()

const store = createStore(
  createRootReducer(history),
  // routerMiddleware 监听路有变化，有变化时，抛出 actions 同步更新，store 的 route 的信息
  composeWithDevTools(applyMiddleware(routerMiddleware(history), sagaMidleware))
)

sagaMidleware.run(rootSage)

export default store