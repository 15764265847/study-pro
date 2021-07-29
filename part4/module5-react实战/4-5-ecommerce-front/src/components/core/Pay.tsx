import React, { FC } from 'react'
import { Button } from 'antd'

import { isAuth } from '../../helpers/auth'
import { Link } from 'react-router-dom'
import { CartItem } from '../../helpers/cart'
import axios from 'axios'
import { API } from '../../config'
import { Jwt } from '../../store/models/auth'

interface Props {
  totalPrice: number
  address: string
  cart: CartItem[]
}

const Pay: FC<Props> = ({ totalPrice, address, cart }) => {

  const getPayUrl = () => {
    axios.post(`${API}/alipay`, {
      totalAmount: totalPrice,
      subject: '测试订单标题',
      body: '测试订单描述',
      products: cart.map(item => {
        return {
          count: item.count,
          product: item._id
        }
      }),
      address,
      userId: (isAuth() as Jwt).user._id
    })
    .then((response) => {
      if (window) {
        window.open(response.data.result, '_blank')
      }
    })
  }

  const showBtn = () => {
    return isAuth() ? <Button onClick={getPayUrl}>提交订单</Button> : <Button><Link to="/signin">登录</Link></Button>
  }

  return (
    <>
      { showBtn() }
    </>
  )
}

export default Pay
