import * as React from 'react'
import { styled, theme } from '../styles/theme'
import { transparentize } from 'polished'
import { Link } from 'gatsby'

import Container from './Container'

const StyledHeader = styled('header')<any>`
  height: ${theme.space[4]};
  background-color: ${theme.colors.primary};
  color: ${transparentize(0.5, theme.colors.white)};
`

const HeaderInner = styled(Container)`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`

const HomepageLink = styled(Link)`
  color: ${theme.colors.white};
  font-size: 1.5rem;
  font-weight: 600;

  &:hover,
  &:focus {
    text-decoration: none;
  }
`

interface HeaderProps {
  title: string
}

const Header: React.SFC<HeaderProps> = ({ title }) => (
  <StyledHeader>
    <HeaderInner>
      <HomepageLink to="/">{title}</HomepageLink>
    </HeaderInner>
  </StyledHeader>
)

export default Header
