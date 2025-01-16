import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { logout } from '@/redux/features/authSlice'
import IconButton from '@mui/material/IconButton'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { useState } from 'react'
import { Avatar } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import RenderControls from "./render-controls";
import { useEditorContext } from "../contexts/editor-context";

/**
 * EditorHeader component renders the top navigation bar of the editor interface.
 * It includes a sidebar trigger button, a separator, and an export video button.
 * The header is sticky-positioned at the top of the viewport.
 *
 * @returns {JSX.Element} A header element containing navigation controls
 */
export function EditorHeader() {
  const { renderMedia, state } = useEditorContext();
  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = useSelector((state: any) => state.auth)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    dispatch(logout())
    router.push('/')
  }

  return (
    <header className="sticky top-0 flex shrink-0 items-center gap-2 bg-gray-900 p-3.5">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-5 bg-gray-300" />

      <div className="flex-grow" />
      <RenderControls handleRender={renderMedia} state={state} />

      <div className="flex items-center ml-4">
        <IconButton onClick={handleClick}>
          <Avatar
            sx={{ width: 32, height: 32 }}
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem disabled className="text-sm text-gray-600">
            {user?.email || 'User'}
          </MenuItem>
          <MenuItem onClick={handleLogout} className="text-sm">
            <ExitToAppIcon fontSize="small" className="mr-2" />
            Logout
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
}
