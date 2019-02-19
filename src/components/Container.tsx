import * as React from 'react'
import { styled } from '../styles/theme'

const StyledContainer = styled.div`
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: auto;
`

interface ContainerProps {
  className?: string
}

const Container: React.SFC<ContainerProps> = ({ children, className }) => (
  <StyledContainer className={className}>{children}</StyledContainer>
)

export default Container
