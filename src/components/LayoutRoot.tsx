import * as React from 'react'
import { GlobalStyle, styled } from '../styles/theme'

const StyledLayoutRoot = styled('div')<any>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

interface LayoutRootProps {
  className?: string
}

const LayoutRoot: React.SFC<LayoutRootProps> = ({ children, className }) => (
  <>
    <GlobalStyle />
    <StyledLayoutRoot className={className}>{children}</StyledLayoutRoot>
  </>
)

export default LayoutRoot
