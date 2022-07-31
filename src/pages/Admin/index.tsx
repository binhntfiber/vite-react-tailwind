import { Route, Redirect } from 'react-router-dom'
import { useEffect } from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import { getLocalAccessToken } from 'services/localstorage/token'
import Home from '../Home'
import Rewards from '../Rewards'
import Validators from '../Validators'
import Myaddresses from '../Myaddresses'
import Profile from '../Profile'
import Sidebar from '../../layouts/Sidebar'
import Header from '../../layouts/Header'
import { useProfile } from 'hooks/useProfile'

const Admin = () => {
  const authToken = getLocalAccessToken()
  const { fetchUserProfile } = useProfile()

  useEffect(() => {
    fetchUserProfile()
  }, [])
  return (
    <StyledContainer>
      <Sidebar />
      <OneRow>
        <Header />
        <Route exact path="/admin/home">
          {authToken ? <Home /> : <Redirect to="/login" />}
        </Route>

        <Route exact path="/admin/rewards">
          {authToken ? <Rewards /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/admin/validators">
          {authToken ? <Validators /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/admin/myaddresses">
          {authToken ? <Myaddresses /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/admin/myprofile">
          {authToken ? <Profile /> : <Redirect to="/login" />}
        </Route>
      </OneRow>
    </StyledContainer>
  )
}

const OneRow = styled(Box)`
  width: 100%;
  padding: 0 50px 50px;
  margin-left: 292px;
  @media (max-width: 768px) {
    margin-left: 0px;
    padding: 0 20px 30px;
  }
`

const StyledContainer = styled(Box)`
  display: flex;
  position: relative;
`

export default Admin
