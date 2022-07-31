import { useApiCall } from './useApiCall'
import { useAppDispatch } from './useApp'
import { setUserData } from 'store/userReducer'
import { getUserProfile } from 'services/api/modules/user'

export const useProfile = () => {
  const dispatch = useAppDispatch()
  const { loading, handleCall: fetchUserProfile } = useApiCall({
    callback: async () => {
      const profile = await getUserProfile()
      dispatch(
        setUserData({
          firstName: profile.first_name,
          lastName: profile.last_name,
          fullName: profile.fullname,
          avatar: profile.avatar,
          status: profile.status,
          email: profile.email,
          phone: profile.phone,
          addresses: profile.address
        })
      )
    }
  })
  return {
    loading,
    fetchUserProfile
  }
}
