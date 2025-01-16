import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { setUser, getUser, clearUser } from '@/app/common/utilities'
import authService from '@/app/services/auth.service'

interface AuthState {
    isLoggedIn: boolean
    user: any | null
    error: string | null
    loading: boolean
}

// Get initial user from localStorage
const user = getUser()

const initialState: AuthState = {
    isLoggedIn: !!user, // Set to true if user exists
    user: user,
    error: null,
    loading: false
}

export const loginAsync = createAsyncThunk(
    'auth/login',
    async ({ email, password, deviceToken }: {
        email: string,
        password: string,
        deviceToken: string
    }, { rejectWithValue }) => {
        try {
            const data = await authService.login(email, password, deviceToken)
            setUser(data)
            return data
        } catch (error: any) {
            const message =
                (error.response?.data?.message) ||
                error.message ||
                'Login failed'
            return rejectWithValue(message)
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isLoggedIn = false
            state.user = null
            clearUser()
        },
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.loading = true
                state.error = null
                console.log('Login Pending - isLoggedIn:', state.isLoggedIn)
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.isLoggedIn = true
                state.user = action.payload
                state.loading = false
                state.error = null
                console.log('Login Fulfilled - isLoggedIn:', state.isLoggedIn)
                console.log('User data:', action.payload)
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.isLoggedIn = false
                state.user = null
                state.loading = false
                state.error = action.payload as string
                console.log('Login Rejected - isLoggedIn:', state.isLoggedIn)
                console.log('Error:', action.payload)
            })
    }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer