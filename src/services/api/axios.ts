import axios from 'axios'
import { API_BASE_URL } from 'constants/env'
import {
  getLocalAccessToken,
  getLocalRefreshToken,
  setTokens
} from 'services/localstorage/token'
import { refreshNewAccessToken } from 'services/api/modules/auth'
/**
 * Create main axios instance
 */
const mainHTTP = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

let isAlreadyFetchingAccessToken = false
let subscribers = []

function onAccessTokenFetched(access_token) {
  const mappedSubcribers = [...subscribers]
  mappedSubcribers.forEach((callback) => callback(access_token))
  subscribers = []
}

function addSubscriber(callback) {
  subscribers.push(callback)
}

mainHTTP.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken()
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token // for Spring Boot back-end
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

mainHTTP.interceptors.response.use(
  (response) => {
    // Return JSON data
    if (response.data) {
      return response.data
    }
    return response
  },
  (error) => {
    const { config } = error
    const originalRequest = config

    const err = (error.response && error.response.data) || error

    if (error.response && error.response.status) {
      error.status = error.response.status
      err.status = error.response.status
    }
    if (error.response && error.response.status === 401) {
      const refreshToken = getLocalRefreshToken()
      if (refreshToken) {
        if (!isAlreadyFetchingAccessToken) {
          isAlreadyFetchingAccessToken = true
          refreshNewAccessToken(refreshToken)
            .then((tokens) => {
              isAlreadyFetchingAccessToken = false
              setTokens(tokens)
              onAccessTokenFetched(tokens.access_token)
            })
            .catch(() => {
              return Promise.reject(err)
            })
        }

        const retryOriginalRequest = new Promise((resolve) => {
          addSubscriber((access_token) => {
            originalRequest.headers.Authorization = `Bearer ${access_token}`
            resolve(axios(originalRequest))
          })
        })
        return retryOriginalRequest
      } else {
        return Promise.reject(err)
      }
    }

    return Promise.reject(err)
  }
)

export default mainHTTP

/**
 * Create custom axios instance
 * @param baseURL Base URL to use in axios
 */
export const createHTTP = (baseURL: string) =>
  axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  })
