import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import Dashboard from './components/admin/Dashboard'
import AdminDashboard from './components/admin/AdminDashboard'
import PrivateRoutes from './components/admin/PrivateRoutes'
import AdminRoute from './components/admin/AdminRoute'
import Home from './components/core/Home'
import Shop from './components/core/Shop'
import Signin from './components/core/Signin'
import Signup from './components/core/Signup'
import AddCategory from './components/admin/AddCategory'
import AddProduct from './components/admin/AddProduct'
import Product from './components/core/Product'
import Cart from './components/core/Cart'
import Success from './components/core/Success'

const Routes = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/shop" component={Shop} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />  
        <PrivateRoutes path="/user/dashboard" component={Dashboard} />
        <AdminRoute path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute path="/create/category" component={AddCategory}  />
        <AdminRoute path="/create/product" component={AddProduct}  />
        <Route path="/product/:productId" component={Product} />  
        <Route path="/cart" component={Cart} />  
        <Route path="/paysuccess" component={Success } />  
      </Switch>
    </HashRouter>
  )
}

export default Routes
 