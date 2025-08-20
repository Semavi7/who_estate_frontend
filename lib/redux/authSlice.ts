import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'


interface User {
  _id: string
  name: string
  surname: string
  email: string
}


interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
}


const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User, accessToken: string }>) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.accessToken = null
    },
  },
})


export const { loginSuccess, logout } = authSlice.actions


export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectUser = (state: RootState) => state.auth.user
export const selectAccessToken = (state: RootState) => state.auth.accessToken



export default authSlice.reducer