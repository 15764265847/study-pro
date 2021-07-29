import { all } from "@redux-saga/core/effects";
import authSaga from "./auth.saga";
import categorySaga from "./category.saga";
import productSage from "./product.saga";

export default function * rootSage () {
  yield all([authSaga(), categorySaga(), productSage()])
}