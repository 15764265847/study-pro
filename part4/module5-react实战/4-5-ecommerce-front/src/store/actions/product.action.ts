import { Product } from "../models/product"

export const GET_PRODUCT = 'GET_PRODUCT'
export const GET_PRODUCT_SUCCESS = 'GET_PRODUCT_SUCCESS'

export interface GetProductAction {
  type: typeof GET_PRODUCT
  sortBy: string
  order: string
  limit: number
}

export interface GetProductSuccessAction {
  type: typeof GET_PRODUCT_SUCCESS
  payload: Product[]
  sortBy: string
}

export const getProduct = (
  sortBy: string,
  order: string = 'desc',
  limit: number = 10
): GetProductAction => {
  return {
    type: GET_PRODUCT,
    sortBy,
    order,
    limit
  }
}

export const getProductSuccess = (payload: Product[], sortBy: string): GetProductSuccessAction => {
  return {
    type: GET_PRODUCT_SUCCESS,
    payload,
    sortBy
  }
}

/*
  搜索
*/
export const SEARCH_PRODUCT = 'SEARCH_PRODUCT'
export const SEARCH_PRODUCT_SUCESS = 'SEARCH_PRODUCT_SUCESS'

export interface SearchProductAction {
  type: typeof SEARCH_PRODUCT
  payload: {
    category: string,
    search: string
  }
}

export interface SearchProductSuccessAction {
  type: typeof SEARCH_PRODUCT_SUCESS
  product: Product[]
}

export const searchProduct = (payload: {
  category: string,
  search: string
}): SearchProductAction => {
  return {
    type: SEARCH_PRODUCT,
    payload
  }
}

export const searchProductSuccess = (product: Product[]): SearchProductSuccessAction => {
  return {
    type: SEARCH_PRODUCT_SUCESS,
    product
  }
}

/**
 * 商品筛选相关
 */

 export const FILTER_PRODUCT = 'FILTER_PRODUCT'
 export const FILTER_PRODUCT_SUCESS = 'FILTER_PRODUCT_SUCESS'

 export interface FilterPayload {
  order?: string
  sortBy?: string
  limit?: number
  skip: number
  filters?: {
    category: string[]
    price: number[]
  }
}

 export interface FilterProductAction {
  type: typeof FILTER_PRODUCT
  payload: FilterPayload
}

export interface FilterProductSuccessAction {
  type: typeof FILTER_PRODUCT_SUCESS
  payload: {
    size: number
    data: Product[]
  },
  skip: number
}

export const filterProduct = (payload: FilterPayload): FilterProductAction => {
  return {
    type: FILTER_PRODUCT,
    payload
  }
}

export const filterProductSuccess = (payload: {
  size: number
  data: Product[]
}, skip: number): FilterProductSuccessAction => {
  return {
    type: FILTER_PRODUCT_SUCESS,
    payload,
    skip
  }
}

/**
 * 通过id获取商品详情
 */

export const GET_PRODUCT_BY_ID = 'GET_PRODUCT_BY_ID'
export const GET_PRODUCT_BY_ID_SUCCESS = 'GET_PRODUCT_BY_ID_SUCCESS'

export interface getProdyctByIdAction {
  type: typeof GET_PRODUCT_BY_ID
  payload: {
    productId: string
  }
}

export interface getProdyctByIdSuccessAction {
  type: typeof GET_PRODUCT_BY_ID_SUCCESS
  payload: Product
}

export const getProdyctById = (payload: {
  productId: string
}): getProdyctByIdAction => {
  return {
    type: GET_PRODUCT_BY_ID,
    payload
  }
}

export const getProdyctByIdSuccess = (payload: Product): getProdyctByIdSuccessAction => {
  return {
    type: GET_PRODUCT_BY_ID_SUCCESS,
    payload
  }
}

 

export type ProductUnionType = GetProductAction | GetProductSuccessAction | SearchProductAction | SearchProductSuccessAction | FilterProductAction | FilterProductSuccessAction | getProdyctByIdAction | getProdyctByIdSuccessAction