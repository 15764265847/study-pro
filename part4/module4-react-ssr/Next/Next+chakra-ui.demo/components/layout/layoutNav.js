import styled from '@emotion/styled';
import { Box, Container } from '@chakra-ui/react';
import Link from 'next/link';

const navList = [
  {
    name: '影片',
    href: ''
  },
  {
    name: '漫画',
    href: ''
  },
  {
    name: '电影',
    href: ''
  },
  {
    name: '电视',
    href: ''
  },
  {
    name: '新闻',
    href: ''
  }
]

const NavBox = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 450px;
  height: 52px;
  margin: auto;
`

const NavItem = styled.a`
  display: block;
  height: 24px;
  padding: 6px 20px;
  font-size: 12px;
  color: #fff;
  line-height: 14px;
`

export default function LayoutNav () {
  return <Box h={'52px'} backgroundColor={'#202020'} borderBottom={'1px solid #393939'}>
    <Container h={'52px'} minW={1200}>
      <NavBox>
        {
          navList.map(item => {
            return <Link href={item.href}><NavItem key={item.name}>{ item.name }</NavItem></Link>
          })
        }
      </NavBox>
    </Container>
  </Box>
}