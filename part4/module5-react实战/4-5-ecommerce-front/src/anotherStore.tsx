import React, { createContext, Dispatch, FC, SetStateAction, useState } from 'react'
import { itemCount } from './helpers/cart'

export const TotalContext = createContext<[number, Dispatch<SetStateAction<number>>]>([0, () => null])

const AnotherStore: FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [count, setCount ] = useState(itemCount())
  return (
    <TotalContext.Provider value={[count, setCount]}>
      
    </TotalContext.Provider>
  )
}

export default AnotherStore
