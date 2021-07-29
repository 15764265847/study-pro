import React from 'react'
import { Col, Menu, Row, Typography, Descriptions } from 'antd'
import { ShoppingCartOutlined, UserOutlined, OrderedListOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

import Layout from '../core/Layout'
import { isAuth } from '../../helpers/auth'
import { Jwt } from '../../store/models/auth'

const { Title } = Typography

const AdminDashboard = () => {
  const { user: { name, email } } = isAuth() as Jwt
  const adminLinks = () => {
    return <>
      <Title level={5}>管理员连接</Title>
      <Menu>
        <Menu.Item>
          <ShoppingCartOutlined />
          <Link to="/create/category">添加分类</Link>
        </Menu.Item>
        <Menu.Item>
          <UserOutlined />
          <Link to="/create/product">添加产品</Link>
        </Menu.Item>
        <Menu.Item>
          <OrderedListOutlined />
          <Link to="">订单列表</Link>
        </Menu.Item>
      </Menu>
    </>
  }

  const adminInfo = () => {
    return <Descriptions bordered title="管理员信息">
      <Descriptions.Item label="昵称">{ name }</Descriptions.Item>
      <Descriptions.Item label="邮件">{ email }</Descriptions.Item>
      <Descriptions.Item label="角色">管理员</Descriptions.Item>
    </Descriptions>
  }
  return (
    <Layout title="管理员 Dashboard" subTile="">
      <Layout title="用户 Dashboard" subTile="">
      <Row>
        <Col span={4}>{ adminLinks() }</Col>
        <Col span={20}>
          { adminInfo() }
        </Col>
      </Row>
    </Layout>
    </Layout>
  )
}

export default AdminDashboard
