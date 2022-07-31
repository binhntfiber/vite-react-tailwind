import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  verifyUserAccount,
  resendVerifyAccountEmail
} from 'services/api/modules/auth'
import { useRouteQuery } from 'hooks/useQuery'
import { useApiCall } from 'hooks/useApiCall'
import ErrorMessage from 'components/ErrorMessage'
import Spinner from 'components/Spinner'

interface FormInputs {
  email: string
}

const schema = yup
  .object({
    email: yup
      .string()
      .required('Email field is required')
      .email('Email field must be a valid email')
  })
  .required()

const ActiveUserForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormInputs>({
    resolver: yupResolver(schema)
  })

  const history = useHistory()
  const [shouldDisplayForm, setShouldDisplayForm] = useState(false)
  const query = useRouteQuery()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { loading: loadingCheckToken, handleCall: handleVerifyToken } =
    useApiCall({
      callback: async () => {
        const token = query.get('token')
        await verifyUserAccount(token)
        history.push('/login')
      },
      successMessage: 'Successfully activate your account.',
      errorMessage: 'Token is invalid, please request a new one',
      errorCallback: () => {
        setShouldDisplayForm(true)
      }
    })
  const emailValue = watch('email', '')

  const { handleCall, loading: loadingRenewToken } = useApiCall({
    callback: async () => {
      if (!executeRecaptcha) {
        throw new Error('Execute recaptcha not yet available')
      }
      const token = await executeRecaptcha('resetEmailActiveAccount')

      await resendVerifyAccountEmail({
        recaptcha: token,
        email: emailValue
      })
    },
    successMessage: 'Successfully sent new active code'
  })

  useEffect(() => {
    handleVerifyToken()
  }, [])

  return (
    <StyledContainer>
      <ChildContainer
        onClick={() => {
          history.push('/')
        }}
      >
        <img src="/images/logo.png" alt="logo" />
      </ChildContainer>

      <LargeGroup style={{ background: "url('images/map-black.png')" }}>
        {shouldDisplayForm && (
          <ForgotDialog>
            <InputGroup>
              <form onSubmit={handleSubmit(handleCall)}>
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
                <ManualLogin disabled={loadingRenewToken}>
                  Resend active code
                </ManualLogin>
              </form>
            </InputGroup>
          </ForgotDialog>
        )}
        <SpinnerWrapper>{loadingCheckToken && <Spinner />}</SpinnerWrapper>
      </LargeGroup>
    </StyledContainer>
  )
}

const LargeGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 92px);
`

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 92px);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

const EmailInput = styled(Box)`
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.15);
`
const EmailGroup = styled(Box)``
const InputGroup = styled(Box)`
  padding: 32px;
`

const ForgotDialog = styled(Box)`
  background: #ffffff;
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  min-width: 100%;
  margin-top: 150px;
  @media (min-width: 768px) {
    min-width: 576px;
  }
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

export default ActiveUserForm
