import qs from 'qs'
import mainHTTP, { createHTTP } from './axios'

export const makeAPI = (baseURL: string) => {
  const http = createHTTP(baseURL)
  return {
    get: <P, R>(url: string, params?: P) => {
      if (params) {
        return http.get<R>(`${url}?${qs.stringify(params)}`)
      }
      return http.get<R>(`${url}`)
    },

    post: <D, R>(url: string, data: D) => http.post<R>(url, data),
    delete: (url: string) => http.delete(url),
    put: <D, R>(url: string, data: D) => http.put<R>(url, data)
  }
}

const api = {
  get: <P, R>(url: string, params?: P) =>
    mainHTTP.get<R>(`${url}?${qs.stringify(params)}`),
  post: <D, R>(url: string, data: D) => mainHTTP.post<R>(url, data),
  delete: (url: string) => mainHTTP.delete(url),
  put: <D, R>(url: string, data: D) => mainHTTP.put<R>(url, data)
}

export default api
