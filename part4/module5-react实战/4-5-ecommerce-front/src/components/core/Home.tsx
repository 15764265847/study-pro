import React, { useEffect } from 'react'
import { Col, Row, Typography } from 'antd'

import Layout from './Layout'
import Search from './Search'
import ProductItem from './ProductItem'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct } from '../../store/actions/product.action'
import { AppSatte } from '../../store/recuders'
import { ProductState } from '../../store/recuders/product.reducer'

const { Title } = Typography

const Home = () => {
  const dispatch = useDispatch()
  const { createdAt, sold } = useSelector<AppSatte, ProductState>(state => state.product)
  useEffect(() => {
    dispatch(getProduct('createdAt'))
    dispatch(getProduct('sold'))
  }, [dispatch])
  return (
    <div>
      <Layout title="拉钩商城" subTile="尽情享受吧">
        <Search></Search>
        <Title level={5}>最新上架</Title>
        <Row gutter={[16, 16]}>
          {
            createdAt.product.map(item => {
              return <Col span={6} key={item._id}>
                <ProductItem product={item}></ProductItem>
              </Col>
            })
          }
          {/* <Col span={6}>
            <ProductItem></ProductItem>
          </Col> */}
        </Row>
        <Title level={5}>最受欢迎</Title>
        <Row gutter={[16, 16]}>
          {
            sold.product.map(item => {
              return <Col span={6} key={item._id}>
                <ProductItem product={item}></ProductItem>
              </Col>
            })
          }
          {/* <Col span={6}>
            <ProductItem ></ProductItem>
          </Col> */}
        </Row>
      </Layout>
    </div>
  )
}

export default Home

