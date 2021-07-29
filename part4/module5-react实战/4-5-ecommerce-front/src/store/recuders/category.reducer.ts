import { CategoryUnion, GET_CATEGORY, GET_CATEGORY_SUCCESS } from "../actions/category.action";
import { Category } from "../models/category";

export interface CategoryState {
  category: {
    loaded: boolean
    success: boolean
    result: Category[]
  }
}
const initialState: CategoryState = {
  category: {
    loaded: false,
    success: false,
    result: []
  }
}
export default function categoryReducer (state = initialState, action: CategoryUnion) {
  let resultDtate = state
  switch (action.type) {
    case GET_CATEGORY:
      resultDtate = {
        ...state,
        category: {
          loaded: false,
          success: false,
          result: []
        }
      }
      break
    case GET_CATEGORY_SUCCESS:
      resultDtate = {
        ...state,
        category: {
          loaded: true,
          success: true,
          result: action.payload
        }
      }
      break
  }
  return resultDtate
}