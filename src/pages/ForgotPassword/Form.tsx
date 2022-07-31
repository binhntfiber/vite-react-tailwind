import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Box from '@mui/material/Box'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import ErrorMessage from 'components/ErrorMessage'
import { useApiCall } from 'hooks/useApiCall'
import { requestForgotPasswordLink } from 'services/api/modules/auth'
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

const ForgotPasswordForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,

    formState: { errors }
  } = useForm<FormInputs>({
    resolver: yupResolver(schema)
  })
  const { executeRecaptcha } = useGoogleReCaptcha()

  const history = useHistory()
  const emailValue = watch('email', '')

  const { handleCall, loading } = useApiCall({
    callback: async () => {
      if (!executeRecaptcha) {
        throw new Error('Execute recaptcha not yet available')
      }
      const token = await executeRecaptcha('forgotPassword')

      await requestForgotPasswordLink({
        recaptcha: token,
        email: emailValue
      })
    },
    successMessage: 'The reset password link has been sent to your email'
  })
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
              <ManualLogin disabled={loading}>Submit</ManualLogin>
            </form>
          </InputGroup>
        </ForgotDialog>
      </LargeGroup>
    </StyledContainer>
  )
}

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

export default ForgotPasswordForm
