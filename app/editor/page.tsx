'use client'

import dynamic from 'next/dynamic'

const Editor = dynamic(
    () => import('@/components/editor/version-5.0.0/components/app-sidebar').then(mod => mod.AppSidebar),
    { ssr: false }
)

export default function EditorPage() {
    return <Editor />
}
