'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { isEmail } from 'validator'
import { Box } from '@mui/material'
import { useCookies } from 'react-cookie'
import randomString from 'randomstring'
import CryptoJS from 'crypto-js'
import { loginAsync } from '@/redux/features/authSlice'
import { closeLoginPanel } from '@/redux/features/settingSlice'
import useDeviceToken from '../../app/helpers/useDeviceToken'
import { SECRET } from '../../config.mjs'
import Image from 'next/image'
import { AppDispatch } from '@/redux/store'

const Login = () => {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const deviceToken = useDeviceToken()
    const [cookies, setCookie] = useCookies(['data'])
    const { isLoggedIn, user: currentUser } = useSelector((state: any) => state.auth)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    // Cookie handling
    console.log('cookies', Object.keys(cookies).length);
    useEffect(() => {
        if (!Object.keys(cookies as Record<string, any>).length) {
            const data = {
                device: randomString.generate(16),
                createDate: new Date()
            }
            setCookie('data', CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString())
        }
    }, [cookies, setCookie])

    // Watch for successful login
    useEffect(() => {
        if (isLoggedIn && currentUser) {
            console.log('Login successful - isLoggedIn:', isLoggedIn)
            console.log('User data:', currentUser)
            dispatch(closeLoginPanel())
            router.push('/versions/5.0.0')
        }
    }, [isLoggedIn, currentUser, dispatch, router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage('')

        try {
            await dispatch(loginAsync({
                email,
                password,
                deviceToken
            }))

            // Verify cookie was set
            const cookies = document.cookie.split(';')
            const userCookie = cookies.find(c => c.trim().startsWith('user='))
            console.log('Cookie after login:', userCookie) // Debug log

            // Get return URL from query params or use default
            const params = new URLSearchParams(window.location.search)
            const returnUrl = params.get('returnUrl') || '/versions/5.0.0'

            dispatch(closeLoginPanel())
            router.push(returnUrl)
        } catch (error: any) {
            setErrorMessage(error || 'Login Failed. Please try again!')
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            <Box p={3} mt={2}>
                <Image
                    src="https://ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    width={96}
                    height={96}
                    className="mx-auto rounded-full mb-4"
                />
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="form-group">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <button
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            {loading && <span className="spinner-border spinner-border-sm mr-2"></span>}
                            <span>Login</span>
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="form-group">
                            <div className="p-3 rounded bg-red-100 text-red-700" role="alert">
                                {errorMessage}
                            </div>
                        </div>
                    )}
                </form>
            </Box>
        </div>
    )
}

export default Login 