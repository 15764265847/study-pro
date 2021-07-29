export const SIGNUP = 'SIGNUP'
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'
export const SIGNUP_FAIL = 'SIGNUP_FAIL'
export const RESET_SIGNUP = 'RESET_SIGNUP'

export interface SignupPayload {
  email: string
  name: string
  password: string
}

export interface SignupAction {
  type: typeof SIGNUP
  payload: SignupPayload
}

export interface SignupSuccessAction {
  type: typeof SIGNUP_SUCCESS
}

export interface SignupFailAction {
  type: typeof SIGNUP_FAIL,
  msg: string
}

export interface ResetSignupAction {
  type: typeof RESET_SIGNUP
}

export const signup = (payload: SignupPayload): SignupAction => ({
  type: SIGNUP,
  payload
})

export const signupSuccess = (): SignupSuccessAction => ({
  type: SIGNUP_SUCCESS
})

export const signupFail = (msg: string): SignupFailAction => ({
  type: SIGNUP_FAIL,
  msg
})

export const resetSignup = (): ResetSignupAction => ({
  type: RESET_SIGNUP
})

/* 登录 */
export const SIGNIN = 'SIGNIN'
export const SIGNIN_SUCCESS = 'SIGNIN_SUCCESS'
export const SIGNIN_FAIL = 'SIGNIN_FAIL'

export interface SigninPayload {
  emial: string
  password: string
}

export interface SigninAction {
  type: typeof SIGNIN
  payload: SigninPayload
}

export interface SigninSuccessAction {
  type: typeof SIGNIN_SUCCESS
}

export interface SigninFailAction {
  type: typeof SIGNIN_FAIL
  msg: string
}

export const signin = (payload: SigninPayload): SigninAction => {
  return {
    type: SIGNIN,
    payload
  }
}

export const signinSuccess = ()=> {
  return {
    type: SIGNIN_SUCCESS
  }
}

export const signinFail = (msg: string): SigninFailAction => {
  return {
    type: SIGNIN_FAIL,
    msg
  }
}


export type AuthUnionType = SignupAction | SignupSuccessAction | SignupFailAction | ResetSignupAction | SigninAction | SigninSuccessAction | SigninFailAction
