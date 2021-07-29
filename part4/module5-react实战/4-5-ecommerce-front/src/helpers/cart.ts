import { Product } from "../store/models/product";

export interface CartItem extends Product {
  count: number
}

export const addItem = (item: Product, next?: () => void) => {
  let cart: CartItem[] = []
  if (typeof window !== 'undefined') {
    const cartLocal = localStorage.getItem('cart')
    if (cartLocal) {
      cart = JSON.parse(cartLocal)
    }
    const cartItem = cart.find(one => one._id === item._id)
    if (cartItem) {
      cartItem.count ++
    } else {
      cart.push({
        ...item,
        count: 1
      })
    }
  }
  localStorage.setItem('cart', JSON.stringify(cart))
  next && next()
}

export const getCart = () => {
  if (typeof window !== 'undefined') {
    const cartLocal = localStorage.getItem('cart')
    if (cartLocal) {
      return JSON.parse(cartLocal)
    }
    return []
  }
}

export const updateItem = (productId: string, count: number) => {
  if (typeof window !== 'undefined') {
    const cartLocal = JSON.parse(localStorage.getItem('cart') || '')
    if (cartLocal) {
      const oneCart = cartLocal.find((item: CartItem) => item._id === productId)
      oneCart.count = count
    }
    localStorage.setItem('cart', JSON.stringify(cartLocal))
    return cartLocal
  }
}

export const deleteItem = (productId: string) => {
  if (typeof window !== 'undefined') {
    const cartLocal = JSON.parse(localStorage.getItem('cart') || '')
    if (cartLocal) {
      const index = cartLocal.findIndex((item: CartItem) => item._id === productId)
      cartLocal.splice(index, 1)
    }
    localStorage.setItem('cart', JSON.stringify(cartLocal))
    return cartLocal
  }
}

export const itemCount = () => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('cart')) {
      return JSON.parse(localStorage.getItem('cart')!).length
    }
  }
  return 0
}