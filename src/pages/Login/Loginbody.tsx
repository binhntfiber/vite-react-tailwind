import React, { useState, useMemo, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import { gapi } from 'gapi-script'
import GoogleLogin from 'react-google-login'
import type { GoogleLoginResponse } from 'react-google-login'

import { GOOGLE_CLIENT_ID } from 'constants/env'
import { useApiCall } from 'hooks/useApiCall'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { login, loginWithGoogle } from 'services/api/modules/auth'
import * as yup from 'yup'
import { toast } from 'react-toastify'

import ErrorMessage from 'components/ErrorMessage'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { setTokens } from 'services/localstorage/token'
interface FormInputs {
  email: string
  password: string
}

const schema = yup
  .object({
    email: yup
      .string()
      .required('Email field is required')
      .email('Email field must be a valid email'),
    password: yup.string().required('Password field is required')
  })
  .required()

const Loginbody: React.FC = () => {
  const [enableSwitch, setEnableSwitch] = useState(false)
  const { executeRecaptcha } = useGoogleReCaptcha()
  const history = useHistory()
  const [googleAuthData, setGoogleAuthData] = useState<null | {
    accessToken: string
    tokenId: string
  }>(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormInputs>({
    resolver: yupResolver(schema)
  })
  const passwordWatch = watch('password', '')
  const emailWatch = watch('email', '')

  const { loading: loadingManualLogin, handleCall: handleManualLogin } =
    useApiCall({
      callback: async () => {
        if (!executeRecaptcha) {
          throw new Error('Execute recaptcha not yet available')
        }
        const recaptchaToken = await executeRecaptcha('login')
        const authTokens = await login({
          email: emailWatch,
          password: passwordWatch,
          recaptcha: recaptchaToken
        })
        setTokens(authTokens)
        history.push('/admin/home')
      },
      successMessage: 'Successfully logged in'
    })

  const { loading: loadingLoginGoogle, handleCall: handleGoogleLogin } =
    useApiCall({
      callback: async () => {
        const authTokens = await loginWithGoogle(
          googleAuthData.accessToken,
          googleAuthData.tokenId
        )
        setTokens(authTokens)
        history.push('/admin/home')
      },
      successMessage: 'Successfully logged in'
    })

  useMemo(() => {
    function start() {
      gapi.client.init({
        clientId: GOOGLE_CLIENT_ID,
        scope: 'email'
      })
    }

    gapi.load('client:auth2', start)
  }, [])
  useEffect(() => {
    if (
      googleAuthData &&
      googleAuthData.accessToken &&
      googleAuthData.tokenId
    ) {
      handleGoogleLogin()
    }
  }, [googleAuthData]) // eslint-disable-line
  const onSuccess = (res: GoogleLoginResponse) => {
    setGoogleAuthData({
      accessToken: res.accessToken,
      tokenId: res.tokenId
    })
  }

  const onFailure = (error: any) => {
    toast.error(error.message ?? error)
  }

  return (
    <StyledContainer>
      <ChildContainer
        onClick={() => {
          history.push('/')
        }}
      >
        <img src="/images/logo.png" alt="logo" />
      </ChildContainer>
      <MapContainer>
        <img src="/images/map-black.png" alt="logo" style={{ width: '100%' }} />
      </MapContainer>
      <LargeGroup>
        <LoginDialog>
          <GoogleContainer>
            <GoogleLogin
              clientId="223584301597-shkcmo3618lo8e4opd5ppmsu9gc160am.apps.googleusercontent.com"
              buttonText="Login via Google"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single_host_origin'}
            />
          </GoogleContainer>
          <hr style={{ margin: '0 15px 0px 15px' }}></hr>
          <InputGroup>
            <form onSubmit={handleSubmit(handleManualLogin)}>
              <EmailGroup>
                <Box
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    lineHeight: '15px',
                    color: '#4B5563',
                    marginBottom: '9px'
                  }}
                >
                  Email Address
                </Box>
                <EmailInput>
                  <input
                    {...register('email')}
                    style={{
                      borderRadius: '6px',
                      border: 'none',
                      width: '100%',
                      outline: 'none',
                      height: '46px',
                      paddingLeft: '20px'
                    }}
                  />
                </EmailInput>
                <ErrorMessage
                  fontSize={'12px'}
                  error={errors.email?.message}
                ></ErrorMessage>
              </EmailGroup>
              <EmailGroup>
                <PasswordTitle>
                  <Box>Password</Box>
                  <ForgotBox
                    style={{ color: 'black' }}
                    onClick={() => {
                      history.push('/forgot-password')
                    }}
                  >
                    Forgot Password
                  </ForgotBox>
                </PasswordTitle>
                <EmailInput>
                  <input
                    {...register('password')}
                    type="password"
                    style={{
                      borderRadius: '6px',
                      border: 'none',
                      width: '100%',
                      outline: 'none',
                      height: '46px',
                      paddingLeft: '20px'
                    }}
                  />
                </EmailInput>
                <ErrorMessage
                  fontSize={'12px'}
                  error={errors.password?.message}
                ></ErrorMessage>
              </EmailGroup>
              <SwitchGroup>
                <IOSwitch
                  enableSwitch={enableSwitch}
                  onClick={() => setEnableSwitch(!enableSwitch)}
                >
                  <SwitchButton enableSwitch={enableSwitch}></SwitchButton>
                </IOSwitch>
                <Box
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    lineHeight: '15px',
                    marginLeft: '14px'
                  }}
                >
                  Keep me signed in
                </Box>
              </SwitchGroup>
              <ManualLogin disabled={loadingManualLogin || loadingLoginGoogle}>
                Login
              </ManualLogin>
            </form>
          </InputGroup>
        </LoginDialog>
        <CreateGroupe>
          <Box
            style={{
              fontSize: '15px',
              fontWeight: 500,
              lineHeight: '15px',
              color: '#6B7280'
            }}
          >
            Don’t have an account?
          </Box>
          <Box
            style={{
              fontSize: '15px',
              fontWeight: 500,
              lineHeight: '15px',
              color: 'black',
              marginLeft: '58px',
              cursor: 'pointer'
            }}
            onClick={() => {
              history.push('/signup')
              // window.location.reload();
            }}
          >
            Create an account here
          </Box>
        </CreateGroupe>
      </LargeGroup>
    </StyledContainer>
  )
}

const ForgotBox = styled(Box)`
  cursor: pointer;
  &:hover {
    color: #2421cf;
    text-decoration: underline;
  }
`

const LargeGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  top: 150px;
  left: calc(50% - 300px);
  position: absolute;
  @media (max-width: 680px) {
    top: 100px;
    left: calc(50% - 200px);
  }
  @media (max-width: 500px) {
    top: 100px;
    width: 300px;
    left: calc(50% - 150px);
  }
`
const CreateGroupe = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 35px;
`
const ManualLogin = styled.button`
  background: #1c39bb;
  border-radius: 6px;
  color: white;
  padding: 16px 0;
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;
  margin-top: 55px;
  cursor: pointer;
`
const SwitchGroup = styled(Box)`
  display: flex;
  align-items: center;
  margin-top: 19px;
`
const SwitchButton = styled(Box)<{ enableSwitch: any }>`
  position: absolute;
  left: ${({ enableSwitch }) => (enableSwitch ? '27px' : '2px')};
  transition: all 0.3s;
  border-radius: 50%;
  background: #d1d5db;
  width: 24px;
  height: 24px;
  background: white;
`
const IOSwitch = styled(Box)<{ enableSwitch: any }>`
  position: relative;
  border-radius: 16px;
  background: ${({ enableSwitch }) => (enableSwitch ? '#1C39BB' : '#D1D5DB')};
  width: 53px;
  height: 28px;
  padding: 2px;
  cursor: pointer;
`
const PasswordTitle = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
  color: #4b5563;
  margin-bottom: 9px;
  margin-top: 31px;
`
const EmailInput = styled(Box)`
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.15);
`
const EmailGroup = styled(Box)``
const InputGroup = styled(Box)`
  padding: 32px;
`
const GoogleContainer = styled(Box)`
  padding: 37px 33px;
  width: 100%;
  > button span {
    width: 500px;
    @media (max-width: 680px) {
      width: 300px;
    }
    @media (max-width: 500px) {
      width: 185px;
    }
  }
`
const LoginDialog = styled(Box)`
  background: #ffffff;
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
`
const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`
const ChildContainer = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 21px 81px 21px 71px;
  cursor: pointer;
`
const MapContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120px 0px 0px;
  width: 100%;
  background: linear-gradient(102.59deg, #ffffff -15.73%, #e8ebf8 126.48%);
`

export default Loginbody
