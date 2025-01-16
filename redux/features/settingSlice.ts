import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoginPanel: false,
}

const settingSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        openLoginPanel: (state) => {
            console.log('Opening login panel...')
            state.isLoginPanel = true
        },
        closeLoginPanel: (state) => {
            console.log('Closing login panel...')
            state.isLoginPanel = false
        },
    },
})

export const {
    openLoginPanel,
    closeLoginPanel,
} = settingSlice.actions
export default settingSlice.reducer 