import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface SupportedNetwork {
  name: string
  id: string
  coingeckoId: string
  image: string
}

const SUPPORTED_NETWORKS: SupportedNetwork[] = [
  {
    name: 'Pocket Network',
    id: 'pocket_network',
    coingeckoId: 'pocket-network',
    image: '/images/pokt.png'
  },
  {
    name: 'FUSE Network',
    id: 'fuse_network',
    coingeckoId: 'use-network-token',
    image: '/images/fuse.png'
  }
]

interface NetworkState {
  supportedNetworks: SupportedNetwork[]
  selectedNetwork: SupportedNetwork
}

const initialState = {
  supportedNetworks: SUPPORTED_NETWORKS,
  selectedNetwork: SUPPORTED_NETWORKS[0]
} as NetworkState

export const networkSlice = createSlice({
  name: 'networks',
  initialState,
  reducers: {
    setSelectedNetwork: (state, action: PayloadAction<NetworkState>) => {
      state.selectedNetwork = {
        ...action.payload.selectedNetwork
      }
    }
  }
})

export const { setSelectedNetwork } = networkSlice.actions

export const networkSelector = (state: RootState) => state.network
