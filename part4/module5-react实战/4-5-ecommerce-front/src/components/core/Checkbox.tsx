import React, { FC, useEffect } from 'react'
import { Typography, Checkbox as AntdCheckbox } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { AppSatte } from '../../store/recuders'
import { CategoryState } from '../../store/recuders/category.reducer'
import { getCategory } from '../../store/actions/category.action'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'

const { Title } = Typography

interface Props {
  setMyFilters: (filters: string[]) => void
}

const Checkbox: FC<Props> = ({setMyFilters}) => {

  const { category: { result } } = useSelector<AppSatte, CategoryState>(state => state.category)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCategory())
  }, [dispatch])
   
  return (
    <>
      <Title level={4}>按照分类筛选</Title>
      <AntdCheckbox.Group className="checkbox-filter" options={result.map(item => {
        return {
          label: item.name,
          value: item._id
        }
      })} onChange={(checkedValue: CheckboxValueType[]) => {
        setMyFilters(checkedValue as string[])
      }} />
    </>
  )
}

export default Checkbox
