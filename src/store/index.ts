import { configureStore } from '@reduxjs/toolkit'
import handleSidebar from './handleSidebar'
import { homeSlice } from './homeReducer'
import { userSlice } from './userReducer'
import { networkSlice } from './networksReducer'

export const store = configureStore({
  reducer: {
    handleSidebar: handleSidebar,
    user: userSlice.reducer,
    home: homeSlice.reducer,
    network: networkSlice.reducer
  }
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
