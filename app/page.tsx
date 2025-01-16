'use client'

import { useDispatch, useSelector } from 'react-redux'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Lock from '@mui/icons-material/Lock'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import {
  openLoginPanel,
  closeLoginPanel,
} from '@/redux/features/settingSlice'
import { logout } from '@/redux/features/authSlice'
import Login from '@/components/auth/Login'
import { useEffect } from 'react'

export default function Home() {
  const dispatch = useDispatch()

  const isLoginPanelopend = useSelector((state: any) => state.setting.isLoginPanel)
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn)

  useEffect(() => {
    console.log('Home Page - isLoggedIn:', isLoggedIn)
  }, [isLoggedIn])

  const openDrawer = () => {
    console.log('Opening drawer...')
    dispatch(openLoginPanel())
  }

  const closeDrawer = () => {
    dispatch(closeLoginPanel())
  }

  const renderAuthButton = () => {
    if (isLoggedIn) {
      return (
        <IconButton
          className="bg-dark cursor-pointer z-50"
          aria-label="logout"
          size="large"
          onClick={() => dispatch(logout())}
          sx={{
            position: 'absolute',
            right: 20,
            top: '20%',
            color: 'white',
            cursor: 'pointer',
            zIndex: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          <ExitToAppIcon fontSize="inherit" />
        </IconButton>
      )
    }
    return (
      <IconButton
        className="bg-dark cursor-pointer z-50"
        aria-label="login"
        size="large"
        onClick={openDrawer}
        sx={{
          position: 'absolute',
          right: 20,
          top: '20%',
          color: 'white',
          cursor: 'pointer',
          zIndex: 50,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <Lock fontSize="inherit" />
      </IconButton>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url("../images/advance-background.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-6xl font-bold text-white mb-6 text-center">
          Scouting4U Video Editor
        </h1>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl text-center">
          Professional online video editing tools for sports analysis
        </p>
      </div>

      {/* Login/Logout Button */}
      {renderAuthButton()}

      {/* Login Drawer */}
      <Drawer
        anchor="right"
        open={isLoginPanelopend}
        onClose={closeDrawer}
      >
        <Box sx={{ width: 360 }} role="presentation">
          <Login />
        </Box>
      </Drawer>
    </div>
  )
}
