import { Button, Col, Empty, RadioChangeEvent, Row, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { filterProduct } from '../../store/actions/product.action'
import { AppSatte } from '../../store/recuders'
import { ProductState } from '../../store/recuders/product.reducer'
// import { useSelector } from 'react-redux'
import Checkbox from './Checkbox'
import Layout from './Layout'
import ProductItem from './ProductItem'
import Redio from './Redio'

const Shop = () => {
  // const state = useSelector(state => state)
  const [myFilters, setMyFilters] = useState<{category: string[], price: number[]}>({category: [], price: []})

  const [skip, setSkip] = useState<number>(0)

  const dispatch = useDispatch()

  const product = useSelector<AppSatte, ProductState>(state => state.product)

  useEffect(() => {
    setSkip(0)
  }, [myFilters])

  useEffect(() => {
    dispatch(filterProduct({
      filters: myFilters,
      skip
    }))
  }, [myFilters, dispatch, skip])

  const filterDom = () => (
    <Space size={'middle'} direction="vertical">
      <Checkbox setMyFilters={(filters: string[]) => setMyFilters({
        ...myFilters,
        category: filters
      })} />
      <Redio setMyFilters={(event: RadioChangeEvent) => setMyFilters({
        ...myFilters,
        price: event.target.value
      })} />
    </Space> 
  )

  const productDom = () => {
    return <Row gutter={[16, 16]}>
      {
        product.filter.result.data.map(item => {
          return <Col span={6} key={item._id}>
            <ProductItem product={item}></ProductItem>
          </Col>
        })
      }
    </Row>
  }

  const loadMore = () => {
    setSkip(skip + 4)
  }

  const loadMoreButton = () => {
    return <Row>
      { 
        product.filter.result.size >= 4 && <Button onClick={loadMore}>加载更多</Button>
      }
    </Row>
  }

  const noData = () => {
    return <Row>
      {product.filter.result.size === 0 && <Empty />}
    </Row>
  }

  return (
    <div>
      <Layout title="拉钩商城" subTile="挑选你喜欢的商品吧">
        <Row>
          <Col span="4">{ filterDom() }</Col>
          <Col span="20">
            { productDom() }
            { loadMoreButton() }
            { noData() }
          </Col>
        </Row>
      </Layout>
    </div>
  )
}

export default Shop
