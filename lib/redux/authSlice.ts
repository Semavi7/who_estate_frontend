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
}


const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
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
  },
})


export const { loginSuccess, logout } = authSlice.actions


export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectUser = (state: RootState) => state.auth.user



export default authSlice.reducer