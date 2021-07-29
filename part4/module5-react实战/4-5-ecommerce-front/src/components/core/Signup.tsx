import React, {useEffect} from 'react'
import { Button, Form, Input, Result } from 'antd'

import Layout from './Layout'
import { resetSignup, signup, SignupPayload } from '../../store/actions/auth.actions'
import { useDispatch, useSelector } from 'react-redux'
import { AppSatte } from '../../store/recuders'
import { AuthState } from '../../store/recuders/auth.reducer'
import { Link } from 'react-router-dom'

const Signup = () => {
  const dispatch = useDispatch()

  const auth = useSelector<AppSatte, AuthState>(state => state.auth)

  const [form] = Form.useForm()

  const onFinish = (value: SignupPayload) => {
    console.log(value)
    dispatch(signup(value))
  }

  useEffect(() => {
    if (auth.signup.loaded  && auth.signup.success) {
      form.resetFields()
    }
  }, [auth, form])

  const showSuccess = () => {
    console.log(auth, 'auth')
    if (auth.signup.loaded  && auth.signup.success) {
      return <Result
        status="success"
        title="注册成功"
        extra={[
          <Button type="primary" key="success-to-jump">
            <Link to="/signin">跳转至登录页面</Link>
          </Button>
        ]}
      />
    }
  }

  const showError = () => {
    console.log(auth, 'error')
    if (auth.signup.loaded  && !auth.signup.success) {
      return <Result
        status="warning"
        title="注册失败"
        subTitle={auth.signup.msg}
      />
    }
  }

  useEffect(() => {
    return () => {
      dispatch(resetSignup())
    }
  }, [dispatch])

  const signupForm = () => <Form form={form} onFinish={onFinish}>
    <Form.Item name="name" label="昵称">
      <Input />
    </Form.Item>
    <Form.Item name="email" label="邮箱">
      <Input.Password />
    </Form.Item> 
    <Form.Item name="password" label="密码">
      <Input.Password />
    </Form.Item> 
    <Form.Item name="email">
      <Button type="primary" htmlType="submit">注册</Button>
    </Form.Item> 
  </Form>

  return (
    <Layout title="注册" subTile="还没有账号，注册一个吧">
      { showSuccess() } 
      { showError() }
      { signupForm() }
    </Layout>
  )
}

export default Signup
