import { Category } from "../models/category"

export const GET_CATEGORY = 'GET_CATEGORY'
export const GET_CATEGORY_SUCCESS = 'GET_CATEGORY_SUCCESS'

export interface GetCategoryAction {
  type: typeof GET_CATEGORY
}

export interface GetCategorySuccessAction {
  type: typeof GET_CATEGORY_SUCCESS,
  payload: Category[]
}

export const getCategory = (): GetCategoryAction => {
  return {
    type: GET_CATEGORY
  }
}

export const getCategorySuccess = (payload: Category[]): GetCategorySuccessAction => {
  return {
    type: GET_CATEGORY_SUCCESS,
    payload 
  }
}

export type CategoryUnion = GetCategoryAction | GetCategorySuccessAction 