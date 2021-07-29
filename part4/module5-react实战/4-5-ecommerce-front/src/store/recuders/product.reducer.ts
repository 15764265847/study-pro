import { FILTER_PRODUCT, FILTER_PRODUCT_SUCESS, GET_PRODUCT, GET_PRODUCT_BY_ID, GET_PRODUCT_BY_ID_SUCCESS, GET_PRODUCT_SUCCESS, ProductUnionType, SEARCH_PRODUCT_SUCESS } from "../actions/product.action";
import { Product } from "../models/product";

export interface ProductState {
  createdAt: {
    loaded: boolean
    success: boolean
    product: Product[]
  }
  sold: {
    loaded: boolean
    success: boolean
    product: Product[]
  },
  search: Product[]
  filter: {
    loaded: boolean
    success: boolean
    result: {
      size: number
      data: Product[]
    }
  },
  product: {
    loaded: boolean
    success: boolean,
    result: Product
  }
}

const initialState: ProductState = {
  createdAt: {
    loaded: false,
    success: false,
    product: []
  },
  sold: {
    loaded: false,
    success: false,
    product: []
  },
  search: [],
  filter: {
    loaded: false,
    success: false,
    result: {
      size: 0,
      data: []
    }
  },
  product: {
    loaded: false,
    success: false,
    result: {
      _id: '',
      name: '',
      price: 0,
      description: '',
      category: {
        _id: '',
        name: ''
      },
      quantity: 0,
      sold: 0,
      photo: new FormData(),
      shipping: false,
      createdAt: '',
    }
  }
}

export default function productReducer (state = initialState, action: ProductUnionType) {
  let resultState = state
  switch(action.type) {
    case GET_PRODUCT:
      resultState = {
        ...state,
        [action.sortBy]: {
          ...state[action.sortBy === 'createdAt' ? 'createdAt' : 'sold'],
          loaded: false,
          success: false
        }
      }
      break
    case GET_PRODUCT_SUCCESS:
      resultState = {
        ...state,
        [action.sortBy]: {
          loaded: true,
          success: true,
          product: action.payload
        }
      }
      break
    case SEARCH_PRODUCT_SUCESS:
      resultState = {
        ...state,
        search: action.product
      }
      break
    case FILTER_PRODUCT:
      resultState = {
        ...state,
        filter: {
          loaded: false,
          success: false,
          result: {
            size: 0,
            data: state.filter.result.data
          }
        }
      }
      break
    case FILTER_PRODUCT_SUCESS:
      const data = action.skip === 0 ? action.payload.data : [...state.filter.result.data, ...action.payload.data]
      resultState = {
        ...state,
        filter: {
          loaded: true,
          success: true,
          result: {
            size: action.payload.size,
            data
          }
        }
      }
      break
    case GET_PRODUCT_BY_ID: 
      resultState = {
        ...state,
        product: {
          ...state.product,
          loaded: false,
          success: false,
        }
      }
      break
    case GET_PRODUCT_BY_ID_SUCCESS:
      resultState = {
        ...state,
        product: {
          loaded: true,
          success: true,
          result: action.payload
        }
      }
      break
  } 
  return resultState
}