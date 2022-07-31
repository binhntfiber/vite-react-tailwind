import { toast } from 'react-toastify'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'

export const useApiCall = <T>({
  callback,
  successMessage,
  errorMessage,
  errorCallback
}: {
  callback: () => T | void
  successMessage?: string
  errorMessage?: string
  errorCallback?: () => void
}) => {
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const handleCall = async () => {
    try {
      setLoading(true)
      const result = await callback()
      if (successMessage) {
        toast.success(successMessage)
      }
      return result
    } catch (error) {
      console.error(error)
      if (errorMessage) {
        toast.error(errorMessage)
      } else {
        toast.error(error.message ?? error)
      }
      if (errorCallback) {
        errorCallback()
      }
      if (error.status === 401) {
        history.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }
  return {
    loading,
    handleCall
  }
}
