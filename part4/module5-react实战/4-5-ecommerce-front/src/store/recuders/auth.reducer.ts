import { AuthUnionType, RESET_SIGNUP, SIGNIN, SIGNIN_FAIL, SIGNIN_SUCCESS, SIGNUP, SIGNUP_FAIL, SIGNUP_SUCCESS } from "../actions/auth.actions";

export interface AuthState {
  signup: {
    loaded: boolean
    success: boolean
    msg: string
  }
  signin: {
    loaded: boolean
    success: boolean
    msg: string
  }
}

const initialState: AuthState = {
  signup: {
    loaded: false,
    success: false,
    msg: ''
  },
  signin: {
    loaded: false,
    success: false,
    msg: ''
  }
}

export default function authReducer (state = initialState, action: AuthUnionType) {
  let result = state
  switch (action.type) {
    case SIGNUP: 
      result = {
        ...state,
        signup: {
          loaded: false,
          success: false,
          msg: ''
        }
      }
      break
    case SIGNUP_SUCCESS: 
      result = {
        ...state,
        signup: {
          loaded: true,
          success: true,
          msg: ''
        }
      }
      break
    case SIGNUP_FAIL: 
      result = {
        ...state,
        signup: {
          loaded: true,
          success: false,
          msg: action.msg
        }
      }
      break
    case RESET_SIGNUP:
      result = {
        signup: {
          loaded: false,
          success: false,
          msg: ''
        },
        signin: {
          loaded: false,
          success: false,
          msg: ''
        }
      }
      break
    case SIGNIN: 
      result = {
        ...state,
        signin: {
          loaded: false,
          success: false,
          msg: ''
        }
      }
      break
    case SIGNIN_SUCCESS: 
      result = {
        ...state,
        signin: {
          loaded: true,
          success: true,
          msg: ''
        }
      }
      break
    case SIGNIN_FAIL: 
      result = {
        ...state,
        signin: {
          loaded: true, 
          success: false,
          msg: action.msg
        }
      }
      break
  }
  return result
}