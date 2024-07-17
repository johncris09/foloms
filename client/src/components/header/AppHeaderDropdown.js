import React, { useState, useEffect } from 'react'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { cilAccountLogout, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')

  const handleLogout = async (e) => {
    e.preventDefault()

    localStorage.removeItem('folomsToken')
    navigate('/login', { replace: true })
  }
  return (
    <>
      <CDropdown className="_avatar" variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 " caret={false}>
          <Avatar userId={userId} />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem href="#/profile">
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem href="#/login" onClick={handleLogout}>
            <CIcon icon={cilAccountLogout} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

export default AppHeaderDropdown
