import React from 'react';
import { Box, Container, Button, Image, IconButton } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { FaSignInAlt, FaSearch } from 'react-icons/fa';
import { BsFillPersonFill  } from 'react-icons/bs';

import LayoutNav from './layoutNav';

const HeaderContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
`

const HeaderContentLogin = styled.div`
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 6px;
  color: #fff;
  border-left: 1px solid #393939;
  border-right: 1px solid #393939;

  & > button {
    padding: 0 10px;
  }
`

const logo = css`
  width: 100px;
  filter: invert(1)
`

const SearchBox = styled.div`
  border-left: 1px solid #393939;
  border-right: 1px solid #393939;
  display: flex;
  justify-content: space-around;
`

const searchBtn = css`
  color: #fff;
  display: flex;
  justify-content: space-around;
`

export default function Layout () {
  return <>
    <Box h={'52px'} backgroundColor={'#202020'} borderBottom={'1px solid #393939'}>
      <Container h={'52px'} minW={1200}>
        <HeaderContentContainer>
          <HeaderContentLogin>
            <Button leftIcon={<FaSignInAlt />} size="sm" colorScheme="whiteAlpha" variant="unstyled">登录</Button>
            <Button leftIcon={<BsFillPersonFill />} size="sm" colorScheme="whiteAlpha" variant="unstyled">注册</Button>
          </HeaderContentLogin>
          <Image css={logo} src="/vercel.svg" />
          <SearchBox>
            <IconButton css={searchBtn} variant="unstyled" icon={<FaSearch />} />
            {/* <Button leftIcon={<FaSearch style={{marginRight: 0}} />}  size="sm" colorScheme="whiteAlpha" variant="unstyled"></Button> */}
          </SearchBox>
        </HeaderContentContainer>
      </Container>
    </Box>
    <LayoutNav></LayoutNav>
  </>
}