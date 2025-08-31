import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'


interface User {
  _id: string
  name: string
  surname: string
  email: string
  phonenumber: number
  role: string
  image: string
}


interface AuthState {
  isAuthenticated: boolean
  user: User | null
  subscribed: boolean
}


const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  subscribed: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User }>) => {
      state.isAuthenticated = true
      state.user = action.payload.user
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
    },
    subscribedTrue: (state) => {
      state.subscribed = true
    },
    subscribedFalse: (state) => {
      state.subscribed = false
    }
  },
})


export const { loginSuccess, logout, subscribedTrue, subscribedFalse } = authSlice.actions


export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectUser = (state: RootState) => state.auth.user
export const selectSubscribed = (state: RootState) => state.auth.subscribed



export default authSlice.reducer