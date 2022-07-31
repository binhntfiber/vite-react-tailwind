import styled from 'styled-components'
import Box from '@mui/material/Box'

import Topbar from './Topbar'
import Mainbody from './Mainbody'

const Landing: React.FC = () => {
  return (
    <StyledContainer>
      <Topbar />
      <Mainbody />
    </StyledContainer>
  )
}

const StyledContainer = styled(Box)``

export default Landing
