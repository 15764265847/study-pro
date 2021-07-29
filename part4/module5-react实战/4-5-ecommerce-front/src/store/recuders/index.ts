import { connectRouter, RouterState } from "connected-react-router";
import { combineReducers } from "redux";
import { History } from 'history'

import testReducer from './test.reducer'
import authReducer, { AuthState } from "./auth.reducer";
import categoryReducer, { CategoryState } from "./category.reducer";
import productReducer, { ProductState } from "./product.reducer";

export interface AppSatte {
  router: RouterState,
  auth: AuthState,
  category: CategoryState,
  product: ProductState
}

const createRootReducer = (history: History) => combineReducers({
  test: testReducer,
  router: connectRouter(history),
  auth: authReducer,
  category: categoryReducer,
  product: productReducer
})

export default createRootReducer