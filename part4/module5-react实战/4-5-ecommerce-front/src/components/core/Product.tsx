import { Col, Row } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { getProdyctById } from '../../store/actions/product.action'
import { AppSatte } from '../../store/recuders'
import { ProductState } from '../../store/recuders/product.reducer'

import Layout from './Layout'
import ProductItem from './ProductItem'

const Product = () => {
  const { productId } = useParams<{ productId: string }>()

  const dispatch = useDispatch()

  const { product: { result: product } } = useSelector<AppSatte, ProductState>(state => state.product)

  useEffect(() => {
    dispatch(getProdyctById({ productId }))
  }, [dispatch, productId])

  return (
    <Layout title="商品名称" subTile="商品描述">
      <Row gutter={36}>
        <Col span={18}>
          <ProductItem product={product} showViewProduct={false} />
        </Col>
        <Col span={6}></Col>
      </Row>
    </Layout>
  )
}

export default Product
