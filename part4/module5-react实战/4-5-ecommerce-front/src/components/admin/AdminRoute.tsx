import React, { FC } from 'react'
import { Redirect, Route, RouteProps } from 'react-router'
import { isAuth } from '../../helpers/auth'
import { Jwt } from '../../store/models/auth'

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>
}

const AdminRoute: FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={(props) => {
      const auth = isAuth() as Jwt
      if (auth) {
        const { user: { role } } = auth
        if (role === 1) return <Component {...props}></Component>
      }
      return <Redirect to="/signin"></Redirect>
    }} />
  )
}

export default AdminRoute
