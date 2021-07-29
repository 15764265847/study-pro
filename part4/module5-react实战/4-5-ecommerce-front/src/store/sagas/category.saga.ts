import { put, takeEvery } from "@redux-saga/core/effects";
import axios from "axios";
import { API } from "../../config";
import { getCategorySuccess, GET_CATEGORY } from "../actions/category.action";
import { Category } from "../models/category";

function * handleGetCategory() {
  const response: {
    data: Category[]
  } = yield axios.get<Category[]>(`${API}/categories`)
  yield put(getCategorySuccess(response.data))
}

export default function * categorySaga () {
  yield takeEvery(GET_CATEGORY, handleGetCategory)
}