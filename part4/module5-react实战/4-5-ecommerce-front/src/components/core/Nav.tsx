import React, { useContext, useEffect } from 'react'
import { Badge, Menu } from 'antd'
import { RouterState } from 'connected-react-router'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AppSatte } from '../../store/recuders'
import { isAuth } from '../../helpers/auth'
import { Jwt } from '../../store/models/auth'
import { TotalContext } from '../../anotherStore'
import { itemCount } from '../../helpers/cart'

function useActive (current: string, path: string): string {
  console.log(path, current)
  console.log(path === current)
  return current === path ? 'ant-menu-item-selected' : ''
}

const Nav = () => {
  const router = useSelector<AppSatte, RouterState>(state => state.router)
  const pathname = router.location.pathname
  const isHome = useActive(pathname, '/')
  const isShop = useActive(pathname, '/shop')
  const isSignin = useActive(pathname, '/signin')
  const isSignup = useActive(pathname, '/signup')
  const isDashboard = useActive(pathname, getDashboardUrl())
  const isCart = useActive(pathname, '/cart')

  const [count, setCount] = useContext(TotalContext)

  useEffect(() => {
    setCount(itemCount())
  })

  function getDashboardUrl (): string {
    let url = '/user/dashboard'
    const auth = isAuth() as Jwt
    if (auth) {
      if (auth.user.role === 1) {
        url = '/admin/dashboard'
      }
    }
    return url
  }

  return (
    <Menu mode="horizontal" selectable={false}>
      <Menu.Item className={isHome}>
        <Link to="/">首页</Link>
      </Menu.Item>
      <Menu.Item className={isShop}>
        <Link to="/shop">商城</Link>
      </Menu.Item>
      <Menu.Item className={isCart}>
        <Link to="/cart">
          购物车
          <Badge count={count} offset={[5, -10]} />
        </Link>
      </Menu.Item>
      {
        !isAuth() ? <>
          <Menu.Item className={isSignin}>
            <Link to="/signin">登录</Link>
          </Menu.Item>
          <Menu.Item className={isSignup}>
            <Link to="/signup">注册</Link>
          </Menu.Item>
        </> : <Menu.Item className={isDashboard}>
          <Link to={ getDashboardUrl() }>dashboard</Link>
        </Menu.Item>
      }
      
    </Menu>
  )
}

export default Nav
