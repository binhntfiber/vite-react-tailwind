import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface UserInfo {
  firstName: string
  lastName: string
  fullName: string
  avatar: string | null
  status: string
  email: string
  phone: string
  addresses: string[]
}

const initialState = {
  firstName: '',
  lastName: '',
  fullName: '',
  avatar: null,
  status: '',
  email: '',
  phone: '',
  addresses: []
} as UserInfo

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<any>) => {
      state.firstName = action.payload.firstName
      state.lastName = action.payload.lastName
      state.email = action.payload.email
      state.fullName = action.payload.fullName
      state.phone = action.payload.phone
      state.avatar = action.payload.avatar
      state.status = action.payload.status
      state.addresses = action.payload.addresses
    },
    addNewAddress: (state, action: PayloadAction<any>) => {
      state.addresses = [...state.addresses, action.payload]
    }
  }
})

export const { setUserData, addNewAddress } = userSlice.actions

export const userSelector = (state: RootState) => state.user
