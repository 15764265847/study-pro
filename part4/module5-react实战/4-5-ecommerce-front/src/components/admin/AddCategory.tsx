import React, { useState, useEffect } from 'react'
import { Button, Form, Input, message } from 'antd'

import Layout from '../core/Layout'
import axios from 'axios'
import { API } from '../../config'
import { isAuth } from '../../helpers/auth'
import { Jwt } from '../../store/models/auth'
import { Link } from 'react-router-dom'

const AddCategory = () => {

  const [name, setName] = useState<string>('')

  const { user, token } = isAuth() as Jwt

  useEffect(() => {
    (async function addCategory() {
      if (!name) {
        return
      }
      try {
        let responseData = await axios.post<{ name: string }>(`${API}/category/create/${user._id}`, {
          name
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        message.success(`[${responseData.data.name}]添加成功`)
      } catch (error) {
        message.error(error.response.data.error)
      }
    })()
  }, [name, token, user._id])

  const onFinish = (value: { name: string }) => {
    console.log(value)
    setName(value.name)
  }

  return (
    <Layout title="添加分类" subTile="">
      <Form onFinish={ onFinish }>
        <Form.Item name="name" label="分类名称">
          <Input />
        </Form.Item>
        <Form.Item name="name">
          <Button type="primary" htmlType="submit">添加分类</Button>
        </Form.Item>
      </Form>
      <Button>
        <Link to="/admin/dashboard">返回dashboard</Link>
      </Button>
    </Layout>
  )
}

export default AddCategory
