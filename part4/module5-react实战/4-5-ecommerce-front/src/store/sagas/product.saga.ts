import { put, takeEvery } from "@redux-saga/core/effects";
import axios from "axios";
import { API } from "../../config";
import { FilterProductAction, filterProductSuccess, FILTER_PRODUCT, GetProductAction, getProductSuccess, getProdyctByIdAction, getProdyctByIdSuccess, GET_PRODUCT, GET_PRODUCT_BY_ID, SearchProductAction, searchProductSuccess, SEARCH_PRODUCT } from "../actions/product.action";
import { Product } from "../models/product";

function * handleGetProduct (action: GetProductAction) {
  const { sortBy, order, limit } = action
  const response: {data: Product[]} = yield axios.get<Product[]>(`${API}/products`, {
    params: {
      sortBy,
      order,
      limit
    }
  })
  yield put(getProductSuccess(response.data, sortBy))
}

function * handleSearchProduct (action: SearchProductAction) {
  const { payload:{ category, search } } = action
  const response: {data: Product[]} = yield axios.get<Product[]>(`${API}/products/search`, {
    params: {
      category,
      search
    }
  })
  yield put(searchProductSuccess(response.data))
}

function * handleFilterProduct (action: FilterProductAction) {
  const response: { 
    data: { 
      size: number, 
      data: Product[] 
    } 
  } = yield axios.post<Product[]>(`${API}/products/filter`, {
    ...action.payload
  })
  yield put(filterProductSuccess(response.data, action.payload.skip))
}

function * handleGetProductById (action: getProdyctByIdAction) {
  const response: { data: Product } = yield axios.get<Product>(`${API}/product/${action.payload.productId}`)
  yield put(getProdyctByIdSuccess(response.data))
}

export default function * productSage () {
  yield takeEvery(GET_PRODUCT, handleGetProduct)
  yield takeEvery(SEARCH_PRODUCT, handleSearchProduct)
  yield takeEvery(FILTER_PRODUCT, handleFilterProduct)
  yield takeEvery(GET_PRODUCT_BY_ID, handleGetProductById)
}