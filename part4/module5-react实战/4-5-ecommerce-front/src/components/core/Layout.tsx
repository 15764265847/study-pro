import { PageHeader } from 'antd'
import React, { FC } from 'react'
import Nav from './Nav'

interface Props {
  children: React.ReactNode
  title: string
  subTile: string
}

const Layout: FC<Props> = ({ children, title, subTile }) => {

  return (
    <div>
      <Nav></Nav>
      <PageHeader className="jumbotron" title={title} subTitle={subTile}></PageHeader>
      <div style={{ width: '85%', margin: '0 auto' }}>
        { children }
      </div>
    </div>
  )
}

export default Layout
