import React from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'

import Loginbody from './Loginbody'

const Login: React.FC = () => {
  return (
    <StyledContainer>
      <Loginbody />
    </StyledContainer>
  )
}

const StyledContainer = styled(Box)``

export default Login
