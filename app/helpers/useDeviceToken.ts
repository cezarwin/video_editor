import axios from 'axios'
import { useState, useEffect } from 'react'
import cookie from 'react-cookies'
import { APIBASEURL } from '../../config.mjs'

// const API_URL = APIBASEURL
const API_URL = "http://localhost:3000";

export default function useDeviceToken() {
    const [deviceToken, setDeviceToken] = useState('')

    useEffect(() => {
        (async () => {
            const setCookie = async () => {
                try {
                    await axios.get(`${API_URL}/set-cookie`, {
                        withCredentials: false
                    })
                    setDeviceToken(cookie.load('deviceToken'))
                } catch (error) {
                    console.error('Error setting cookie:', error)
                }
            }

            const getCookie = async () => {
                try {
                    const res = await axios.get(`${API_URL}/get-cookie`, {
                        withCredentials: true
                    })
                    console.log('res.data', res);
                    if (res && res.data !== '') {
                        setDeviceToken(res.data)
                        return true
                    }
                    return false
                } catch (error) {
                    console.error('Error fetching cookie:', error)
                    return false
                }
            }

            const isSetToken = await getCookie()
            if (!isSetToken) {
                await setCookie()
            }
        })()
    }, [])

    return deviceToken
} 