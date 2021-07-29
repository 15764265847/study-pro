import React, { useEffect } from 'react'
import { Button, Col, Divider, Form, Input, Row, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { getCategory } from '../../store/actions/category.action'
import { searchProduct } from '../../store/actions/product.action'
import { AppSatte } from '../../store/recuders'
import { CategoryState } from '../../store/recuders/category.reducer'
import { ProductState } from '../../store/recuders/product.reducer'
import ProductItem from './ProductItem'

const Search = () => {
  const dispatch = useDispatch()

  const { category } = useSelector<AppSatte, CategoryState>(state => state.category)

  const { search } = useSelector<AppSatte, ProductState>(state => state.product)

  useEffect(() => {
    dispatch(getCategory())
  }, [dispatch])

  const onFinish = (value: {category: string, search: string}) => {
    dispatch(searchProduct({ category: value.category, search: value.search }))
  }
  return ( 
    <>
      <Form layout="inline" onFinish={onFinish} initialValues={{
        category: 'All'
      }}>
        <Input.Group compact>
          <Form.Item name="category">
            <Select>
              <Select.Option value="All">所有分类</Select.Option>
              {
                category.result.map(item => {
                  return <Select.Option value={item._id} key={item._id}>{ item.name }</Select.Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item name="search">
            <Input placeholder="请输入关键字" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">搜索</Button>
          </Form.Item> 
        </Input.Group>
      </Form>
      <Divider></Divider>
      <Row gutter={[16, 16]}>
        {
          search.map(item => {
            return <Col span={6}>
              <ProductItem product={item}></ProductItem>
            </Col>
          })
        }
        {/* <Col span={6}>
          <ProductItem></ProductItem>
        </Col> */}
      </Row>
    </>
  )
}

export default Search
