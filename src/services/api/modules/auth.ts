import api from '../index'
import { SignUpPayload } from 'typings/auth.type'

export const signUp = async (payload: SignUpPayload) => {
  const { data } = await api.post<SignUpPayload, boolean>(
    '/api/v1/users/register',
    payload
  )
  return data
}

export const verifyUserAccount = async (code: string) => {
  const { data } = await api.post<{ verify_code: string }, boolean>(
    '/api/v1/users/confirm-account',
    {
      verify_code: code
    }
  )
  return data
}

export const resendVerifyAccountEmail = async ({
  recaptcha,
  email
}: {
  recaptcha: string
  email: string
}) => {
  const { data } = await api.post<
    { 'g-recaptcha-response': string; email: string; type: string },
    boolean
  >('/api/v1/users/resend-email', {
    'g-recaptcha-response': recaptcha,
    email: email,
    type: 'REGISTER'
  })
  return data
}

export const requestForgotPasswordLink = async ({
  recaptcha,
  email
}: {
  recaptcha: string
  email: string
}) => {
  const { data } = await api.post<
    { 'g-recaptcha-response': string; email: string; type: string },
    boolean
  >('/api/v1/users/resend-email', {
    'g-recaptcha-response': recaptcha,
    email: email,
    type: 'FORGOT_PASSWORD'
  })
  return data
}

export const setNewPassword = async ({
  recaptcha,
  password,
  code
}: {
  recaptcha: string
  password: string
  code: string
}) => {
  const { data } = await api.post<
    { 'g-recaptcha-response': string; password: string; verify_code: string },
    boolean
  >('/api/v1/users/set-password', {
    'g-recaptcha-response': recaptcha,
    password,
    verify_code: code
  })
  return data
}

export const login = async ({
  email,
  password,
  recaptcha
}: {
  recaptcha: string
  password: string
  email: string
}) => {
  const { data } = await api.post<
    { 'g-recaptcha-response': string; password: string; email: string },
    boolean
  >('/api/v1/users/token', {
    'g-recaptcha-response': recaptcha,
    password,
    email
  })
  return data
}

export const refreshNewAccessToken = async (refreshToken: string) => {
  try {
    const { data } = await api.post<
      { refresh_token: string },
      {
        access_token: string
        refresh_token: string
        expires_in: number
        token_type: string
      }
    >('/api/v1/users/refresh-token', {
      refresh_token: refreshToken
    })
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const loginWithGoogle = async (
  googleAccessToken: string,
  googleTokenId: string
) => {
  const { data } = await api.post<
    { access_token: string; token_id: string },
    {
      access_token: string
      refresh_token: string
      expires_in: number
      token_type: string
    }
  >('/api/v1/users/login-with-google', {
    access_token: googleAccessToken,
    token_id: googleTokenId
  })
  return data
}
