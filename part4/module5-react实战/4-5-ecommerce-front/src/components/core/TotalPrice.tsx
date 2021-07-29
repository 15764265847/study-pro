import React, { FC, useEffect } from 'react'
import { Typography } from 'antd'

import { CartItem } from '../../helpers/cart'

interface Props {
  cart: CartItem[],
  setTotalPrice: (price: number) => void
}

const { Title } = Typography

const TotalPrice: FC<Props> = ({ cart, setTotalPrice }) => {

  const getTotalPrice = () => {
    return +cart.reduce((total, item) => {
      total += item.price * item.count
      return total
    }, 0).toFixed(2)
  }

  useEffect(() => {
    setTotalPrice(getTotalPrice())
  }, [cart, setTotalPrice])

  return (
    <Title level={5}>
      商品总价：{ getTotalPrice() }
    </Title>
  )
}

export default TotalPrice
