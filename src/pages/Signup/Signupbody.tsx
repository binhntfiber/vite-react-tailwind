import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import { COUNTRIES_DIAL_CODE } from 'constants/country'
import Popover from '@mui/material/Popover'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useHistory } from 'react-router-dom'
import { signUp } from 'services/api/modules/auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import ErrorMessage from 'components/ErrorMessage'
import PasswordCheck from 'components/PasswordChecks'
import { toast } from 'react-toastify'

interface Country {
  name: string
  dial_code: string
  code: string
}

interface FormInputs {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  passwordConfirm: string
}

const schema = yup
  .object({
    firstName: yup.string().required('First Name field is required'),
    lastName: yup.string().required('Last Name field is required'),
    email: yup
      .string()
      .required('Email field is required')
      .email('Email field must be a valid email'),
    phone: yup.string().required('Phone field is required'),
    password: yup
      .string()
      .required('Password field is required')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/,
        'Invalid password format'
      ),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
  })
  .required()

const Signupbody: React.FC = () => {
  const history = useHistory()
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormInputs>({
    resolver: yupResolver(schema)
  })
  const [country, setCountry] = useState<Country>(COUNTRIES_DIAL_CODE[0])
  const [agreed, setAgreed] = useState(false)

  const [loading, setLoading] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const { executeRecaptcha } = useGoogleReCaptcha()

  const handleReCaptchaVerify = useCallback(
    async (data: FormInputs) => {
      try {
        if (!executeRecaptcha) {
          throw new Error('Execute recaptcha not yet available')
        }
        setLoading(true)
        const token = await executeRecaptcha('signUp')

        const isSuccess = await signUp({
          'g-recaptcha-response': token,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password: data.password,
          phone: data.phone,
          country_phone_code: country.dial_code
        })
        if (isSuccess) {
          toast.success(
            'Successfully sign up your account. Please check email!'
          )
          reset()
        } else {
          toast.error('Sign up unsuccessfully')
        }
      } catch (error) {
        console.error(error)
        toast.error(error.message ?? error)
      } finally {
        setLoading(false)
      }
    },
    [executeRecaptcha, country]
  )

  const passwordWatch = watch('password', '')

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCountryClick = (selected: Country) => {
    setCountry(selected)
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const checkboxLabel = (
    <div style={{ fontSize: '10px', fontWeight: 700 }}>
      By creating an account, you agree to our{' '}
      <a
        href="/privacy_policy.pdf"
        style={{ color: '#1C39BB', fontSize: '10px' }}
        target="_blank"
      >
        Terms of Service
      </a>{' '}
      and we will use your data per our{' '}
      <a
        href="/terms.pdf"
        target="_blank"
        style={{ color: '#1C39BB', fontSize: '10px' }}
      >
        Privacy Policy.
      </a>
    </div>
  )

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
        <SignupDialog>
          <form onSubmit={handleSubmit(handleReCaptchaVerify)}>
            <CreateTitle>Create An Account</CreateTitle>
            <InputGroup>
              <Box>
                <InputTitle style={{ marginTop: '16px' }}>
                  First Name
                </InputTitle>
                <TextInput>
                  <input
                    {...register('firstName')}
                    placeholder="Your first name"
                    style={{
                      borderRadius: '6px',
                      border: 'none',
                      width: '100%',
                      outline: 'none',
                      height: '46px',
                      paddingLeft: '20px'
                    }}
                  />
                </TextInput>
                <ErrorMessage
                  fontSize={'12px'}
                  error={errors.firstName?.message}
                ></ErrorMessage>
              </Box>
              <Box>
                <InputTitle>Last Name</InputTitle>
                <TextInput>
                  <input
                    {...register('lastName')}
                    placeholder="Your last name"
                    style={{
                      borderRadius: '6px',
                      border: 'none',
                      width: '100%',
                      outline: 'none',
                      height: '46px',
                      paddingLeft: '20px'
                    }}
                  />
                </TextInput>
                <ErrorMessage
                  fontSize={'12px'}
                  error={errors.lastName?.message}
                ></ErrorMessage>
              </Box>
              <Box>
                <InputTitle>Email Address</InputTitle>
                <TextInput>
                  <input
                    {...register('email')}
                    placeholder="Enter your email address"
                    style={{
                      borderRadius: '6px',
                      border: 'none',
                      width: '100%',
                      outline: 'none',
                      height: '46px',
                      paddingLeft: '20px'
                    }}
                  />
                </TextInput>
                <ErrorMessage
                  fontSize={'12px'}
                  error={errors.lastName?.message}
                ></ErrorMessage>
                <InputTitle style={{ marginTop: '13px', fontSize: '10px' }}>
                  We’ll never share your email to anyone else.
                </InputTitle>
              </Box>
              <Box>
                <InputTitle>Phone Number</InputTitle>
                <TextInput>
                  {/* <select
                  onChange={handleChangeCountry}
                  value={country}
                  style={{}}
                >
                  {COUNTRIES_DIAL_CODE.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name} ({option.dial_code})
                    </option>
                  ))}
                </select> */}
                  <CountryButton aria-describedby={id} onClick={handleClick}>
                    <div>
                      {country.name}({country.dial_code})
                    </div>
                    <div>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </CountryButton>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                  >
                    <div style={{ maxHeight: '500px' }}>
                      {/* <div></div> */}
                      {COUNTRIES_DIAL_CODE.map((option) => (
                        <CountryOption
                          onClick={() => handleCountryClick(option)}
                          key={option.code}
                        >
                          {option.name} ({option.dial_code})
                        </CountryOption>
                      ))}
                    </div>
                  </Popover>
                </TextInput>
                <TextInput style={{ marginTop: '10px' }}>
                  <input
                    {...register('phone')}
                    pattern="[0-9]*"
                    placeholder="Enter your phone number"
                    style={{
                      borderRadius: '6px',
                      border: 'none',
                      width: '100%',
                      outline: 'none',
                      height: '46px',
                      paddingLeft: '20px'
                    }}
                  />
                </TextInput>
                <ErrorMessage
                  fontSize={'12px'}
                  error={errors.phone?.message}
                ></ErrorMessage>
              </Box>
              <Box>
                <InputTitle>Password</InputTitle>
                <TextInput style={{ marginTop: '10px' }}>
                  <input
                    {...register('password')}
                    placeholder="Please enter your password"
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
                </TextInput>
                <ErrorMessage
                  fontSize={'12px'}
                  error={errors.password?.message}
                ></ErrorMessage>
                <PasswordCheck password={passwordWatch} />
                {/* <InputTitle style={{ marginTop: "13px", fontSize: "10px" }}>
                  An easy to remember strong password suggestion (all lower
                  case, single space between words).
                </InputTitle> */}
              </Box>
              <Box>
                <InputTitle>Password (again)</InputTitle>
                <TextInput style={{ marginTop: '10px' }}>
                  <input
                    {...register('passwordConfirm')}
                    placeholder="Please enter your password"
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
                </TextInput>
                <ErrorMessage
                  fontSize={'12px'}
                  error={errors.passwordConfirm?.message}
                ></ErrorMessage>
              </Box>

              <div>
                <FormControlLabel
                  style={{
                    marginTop: '20px'
                  }}
                  control={
                    <Checkbox
                      checked={agreed}
                      onChange={() => setAgreed(!agreed)}
                    />
                  }
                  label={checkboxLabel}
                />
              </div>
              <SignupButton disabled={loading || !agreed}>
                Create Liquify Account
              </SignupButton>
            </InputGroup>
          </form>
        </SignupDialog>
        <CreateGroupe>
          <Box style={{ fontSize: '15px', fontWeight: 500, color: '#6B7280' }}>
            Already have an account?
          </Box>
          <Box
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: 'black',
              marginLeft: '58px',
              cursor: 'pointer'
            }}
            onClick={() => {
              history.push('/login')
              window.location.reload()
            }}
          >
            Login here!
          </Box>
        </CreateGroupe>
      </LargeGroup>
    </StyledContainer>
  )
}

const ConfirmGroup = styled(Box)`
  display: flex;
  align-items: center;
`
const LargeGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  top: 150px;
  left: calc(50% - 300px);
  position: absolute;
  @media (max-width: 1000px) {
    left: calc(50% - 330px);
  }
  @media (max-width: 768px) {
    top: 100px;
    left: calc(50% - 250px);
  }
  @media (max-width: 550px) {
    top: 100px;
    left: calc(50% - 200px);
  }
  @media (max-width: 425px) {
    top: 100px;
    left: calc(50% - 170px);
  }
  @media (max-width: 375px) {
    top: 100px;
    left: calc(50% - 150px);
  }
`
const CreateGroupe = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 35px;
  padding: 0 20px 20px;
`
const SignupButton = styled.button`
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
  border: none;
  outline: none;
  &:disabled {
    background: #c4c4c4;
  }
`
const InputTitle = styled(Box)`
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  margin-top: 31px;
  margin-bottom: 9px;
`
const CreateTitle = styled(Box)`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  display: flex;
  align-items: center;
  color: #000000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 7px 0;
  margin: 37px 64px 0px 64px;
  @media (max-width: 550px) {
    margin: 37px 32px 0px 32px;
  }
`
const TextInput = styled(Box)`
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.15);
`
const InputGroup = styled(Box)`
  padding: 0 82px 50px;
  @media (max-width: 550px) {
    padding: 0 30px 30px;
  }
  @media (max-width: 450px) {
    padding: 0 30px 30px;
  }
`
const SignupDialog = styled(Box)`
  background: #ffffff;
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  width: 666px;
  @media (max-width: 768px) {
    width: 500px;
  }
  @media (max-width: 550px) {
    width: 400px;
  }
  @media (max-width: 425px) {
    width: 350px;
  }
  @media (max-width: 375px) {
    width: 300px;
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
  padding: 21px 20px 21px 20px;
  cursor: pointer;
`
const MapContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120px 0px;
  width: 100%;
  background: linear-gradient(102.59deg, #ffffff -15.73%, #e8ebf8 126.48%);
`
const CountryButton = styled.button`
  border-radius: 6px;
  border: none;
  width: 100%;
  outline: none;
  height: 46px;
  padding-left: 20px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const CountryOption = styled.div`
  padding: 8px 16px;
  cursor: pointer;
`

export default Signupbody
