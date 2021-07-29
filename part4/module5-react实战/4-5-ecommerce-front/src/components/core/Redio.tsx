import React, { FC } from 'react'
import { List, Typography, Radio as AntdRadio, RadioChangeEvent } from 'antd'
import prices from '../../helpers/price'

const { Title } = Typography

interface Props {
  setMyFilters: (event: RadioChangeEvent) => void
}

const Redio: FC<Props> = ({ setMyFilters }) => {
   
  return (
    <>
      <Title level={4}>按照价格筛选</Title>
      <AntdRadio.Group>
        <List
          dataSource={prices}
          renderItem={item => {
            return <>
              <List.Item><AntdRadio onChange={setMyFilters} value={item.array}>{ item.name }</AntdRadio></List.Item>
            </>
          }}
        />
      </AntdRadio.Group>
    </>
  )
}

export default Redio
