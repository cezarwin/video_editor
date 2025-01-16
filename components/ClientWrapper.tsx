// app/components/ClientWrapper.tsx
'use client'; // This is the important part!

import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { CookiesProvider } from 'react-cookie'
import { Toaster } from "@/components/ui/toaster"
import { getUser } from '@/app/common/utilities'
import { useState, useEffect } from 'react'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const user = getUser()
        if (user) {
            store.dispatch({ type: 'auth/initializeState', payload: user })
        }
        setIsReady(true)
    }, [])

    if (!isReady) {
        return null // or a loading spinner
    }

    return (
        <Provider store={store}>
            <CookiesProvider>
                <main className="bg-gray-900">
                    {children}
                    <Toaster />
                </main>
            </CookiesProvider>
        </Provider>
    )
}