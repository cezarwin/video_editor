import { NextResponse } from 'next/server'
import { APIBASEURL } from '../../../../config.mjs'
import axios from 'axios'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, deviceToken } = body

        const response = await axios.post(`${APIBASEURL}/auth/signin`, {
            email,
            password,
            deviceToken
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://geniusball.scouting4u.com'
            }
        })

        return NextResponse.json(response.data)
    } catch (error: any) {
        return NextResponse.json(
            { message: error.response?.data?.message || 'Login failed' },
            { status: error.response?.status || 500 }
        )
    }
} 