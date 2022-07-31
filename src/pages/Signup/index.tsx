import styled from 'styled-components'
import Box from '@mui/material/Box'

import Signupbody from './Signupbody'

const Signup: React.FC = () => {
  return (
    <StyledContainer>
      <Signupbody />
    </StyledContainer>
  )
}

const StyledContainer = styled(Box)``

export default Signup
