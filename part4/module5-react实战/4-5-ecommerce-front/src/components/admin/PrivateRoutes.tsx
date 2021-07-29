import React, { FC } from 'react'
import { Redirect, Route, RouteProps } from 'react-router'
import { isAuth } from '../../helpers/auth'

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>
}

const PrivateRoutes: FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={(props) => {
      const auth = isAuth()
      if (auth) {
        return <Component {...props}></Component>
      }
      return <Redirect to="/signin"></Redirect>
    }} />
  )
}

export default PrivateRoutes
