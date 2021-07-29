import axios from 'axios'
import { put, takeEvery } from 'redux-saga/effects'

import { API } from '../../config'
import { SIGNIN, SigninAction, SIGNUP, SignupAction, signupFail, signupSuccess, signinSuccess, signinFail } from '../actions/auth.actions'

export interface ResponseGenerator{
  config?:any,
  data?:any,
  headers?:any,
  request?:any,
  status?:number,
  statusText?:string
}

function * handleSignup (action: SignupAction) {
  try {
    yield axios.post(`${API}/signup`, action.payload)
    yield put(signupSuccess())
  } catch (error) {
    yield put(signupFail(error.response.data.error))
  }
}

function * handleSignin (action: SigninAction) {
  try {
    let response: ResponseGenerator = yield axios.post(`${API}/signin`, action.payload)
    localStorage.setItem('jwt', JSON.stringify(response.data))
    yield put(signinSuccess())
  } catch (error) {
    yield put(signinFail(error.response.data.error))
  }
}

export default function * authSaga () {
  yield takeEvery(SIGNUP, handleSignup)
  yield takeEvery(SIGNIN, handleSignin)
}