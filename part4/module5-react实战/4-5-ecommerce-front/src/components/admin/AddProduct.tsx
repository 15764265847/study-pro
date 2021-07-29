import React, {useEffect, useState} from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Select, Upload } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import Layout from '../core/Layout'
import { getCategory } from '../../store/actions/category.action'
import { AppSatte } from '../../store/recuders'
import { CategoryState } from '../../store/recuders/category.reducer'
import { RcFile } from 'antd/lib/upload'
import axios from 'axios'
import { API } from '../../config'
import { isAuth } from '../../helpers/auth'
import { Jwt } from '../../store/models/auth'

const AddProduct = () => {
  const distpatch = useDispatch()

  const category = useSelector<AppSatte, CategoryState>(state => state.category)

  const [file, setFile] = useState<RcFile>()

  useEffect(() => {
    distpatch(getCategory())
  }, [distpatch])

  const uploadProps = {
    accept: 'image/*',
    beforeUpload: function (file: RcFile) {
      setFile(file)
      return false
    }
  }

  const auth = isAuth() as Jwt

  const onFinish = (product: any) => {
    const formdata = new FormData()
    Object.entries(product).forEach(([key, value]) => {
      formdata.set(key, value as string)
    })
    if (typeof file !== 'undefined') {
      formdata.set('photo', file)
    }

    axios.post(`${API}/product/create/${auth.user._id}`, formdata, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    }).then(() => {
      message.success('添加成功')
    }).catch(err => {
      message.error('添加失败')
    })
  }

  const addProductForm = () => {
    return <Form initialValues={{
      category: ''
    }} onFinish={onFinish}>
      <Form.Item>
        <Upload {...uploadProps}>
          <Button icon={ <UploadOutlined /> }>上传商品封面</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="name" label="商品名称">
        <Input />
      </Form.Item>
      <Form.Item name="description" label="商品描述">
        <Input />
      </Form.Item>
      <Form.Item name="price" label="商品价格">
        <Input />
      </Form.Item>
      <Form.Item name="category" label="商品分类">
        <Select>
          <Select.Option value="">请选择分类</Select.Option>
          {
            category.category.result.map(item => {
              return <Select.Option key={item._id} value={item._id}>
                { item.name }
              </Select.Option>
            })
          } 
        </Select>
      </Form.Item>
      <Form.Item name="quantity" label="商品库存">
        <Input />
      </Form.Item>
      <Form.Item name="shipping" label="商品是否需要运输">
        <Select>
          <Select.Option value={1}>
            是
          </Select.Option>
          <Select.Option value={0}>
            否
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary">提交</Button>
      </Form.Item>
    </Form>
  }

  return (
    <Layout title="添加商品" subTile="">
      { addProductForm() }
    </Layout>
  )
}

export default AddProduct
