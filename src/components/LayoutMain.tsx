import * as React from 'react'
import { styled } from '../styles/theme'

const StyledLayoutMain = styled('main')<any>`
  display: flex;
  flex-direction: column;
  flex: 1;
`

interface LayoutMainProps {
  className?: string
}

const LayoutMain: React.SFC<LayoutMainProps> = ({ children, className }) => (
  <StyledLayoutMain className={className}>{children}</StyledLayoutMain>
)

export default LayoutMain
