import React from 'react'
import { Button, Form, Input, Result } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import Layout from './Layout'
import { signin, SigninPayload } from '../../store/actions/auth.actions'
import { AuthState } from '../../store/recuders/auth.reducer'
import { AppSatte } from '../../store/recuders'
import { isAuth } from '../../helpers/auth'
import { Jwt } from '../../store/models/auth'
import { Redirect } from 'react-router'

const Signup = () => {
  const dispatch = useDispatch()
  const auth = useSelector<AppSatte, AuthState>(state => state.auth)
  const onFinish = (value: SigninPayload) => {
    dispatch(signin(value))
  }

  const redirectToDashboard = () => {
    const auth = isAuth()
    if (auth) {
      const { user: { role } } = auth as Jwt
      if (role === 0) {
        return <Redirect to="/user/dashboard"></Redirect>
      } else {
        return <Redirect to="/admin/dashboard"></Redirect>
      } 
    }
  }

  const showError = () => {
    console.log(auth, 'error')
    if (auth.signin.loaded  && !auth.signin.success) {
      return <Result
        status="warning"
        title="登录失败"
        subTitle={auth.signup.msg}
      />
    }
  }

  const sininForm = () => <Form onFinish={onFinish}>
    <Form.Item name="email" label="邮箱">
      <Input.Password />
    </Form.Item> 
    <Form.Item name="password" label="密码">
      <Input.Password />
    </Form.Item> 
    <Form.Item name="email">
      <Button type="primary" htmlType="submit">登录</Button>
    </Form.Item> 
  </Form>

  return (
    <Layout title="登录" subTile="嘿，小伙伴，赶紧登录到拉钩电商系统吧">
      { showError() }
      { redirectToDashboard() }
      { sininForm() }
    </Layout>
  )
}

export default Signup
