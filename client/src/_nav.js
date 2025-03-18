import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cibLetterboxd,
  cilBadge,
  cilBuilding,
  cilChildFriendly,
  cilClipboard,
  cilCog,
  cilFile,
  cilFolderOpen,
  cilInbox,
  cilIndustry,
  cilInstitution,
  cilLibraryBuilding,
  cilPeople,
  cilSpeedometer,
  cilTruck,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { faGasPump } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const _nav = (userInfo) => {
  let items = []

  // Super Admin
  if (userInfo.role_type === 'Super Admin') {
    items = [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Trip Ticket',
        to: '/trip_ticket',
        icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Old Trip Ticket',
        to: '/old_trip_ticket',
        // badge: {
        //   color: 'info',
        //   text: 'NEW',
        // },
        icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Equipment',
        to: '/equipment',
        icon: <CIcon icon={cilChildFriendly} customClassName="nav-icon" />,
      },
      // {
      //   component: CNavItem,
      //   name: 'Funds',
      //   to: '/funds',
      //   badge: {
      //     color: 'info',
      //     text: 'NEW',
      //   },
      //   icon: <CIcon icon={cilInstitution} customClassName="nav-icon" />,
      // },
      {
        component: CNavItem,
        name: 'Delivery',
        to: '/delivery',

        icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Supplier',
        to: '/supplier',

        icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Driver',
        to: '/driver',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Office',
        to: '/office',
        icon: <CIcon icon={cilInstitution} customClassName="nav-icon" />,
      },

      {
        component: CNavItem,
        name: 'Report',
        to: '/report',
        icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
      },

      {
        component: CNavTitle,
        name: 'Utilities',
      },
      {
        component: CNavGroup,
        name: 'Configuration',
        to: '/manage',
        icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Product',
            to: '/product',
          },

          {
            component: CNavItem,
            name: 'Equipment Type',
            to: '/equipment_type',
          },
          {
            component: CNavItem,
            name: 'Report Type',
            to: '/report_type',
          },
          {
            component: CNavItem,
            name: 'Control Number',
            to: '/control_number',
          },
        ],
      },

      {
        component: CNavItem,
        name: 'User',
        to: '/user',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    ]
  }
  //  Admin
  if (userInfo.role_type === 'Admin') {
    items = [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Trip Ticket',
        to: '/trip_ticket',
        icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Old Trip Ticket',
        to: '/old_trip_ticket',
        icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
      },

      {
        component: CNavItem,
        name: 'Delivery',
        to: '/delivery',

        icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Office',
        to: '/office',
        icon: <CIcon icon={cilInstitution} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Report',
        to: '/report',
        icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
      },
      {
        component: CNavGroup,
        name: 'Configuration',
        to: '/manage',
        icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Product',
            to: '/product',
          },

          {
            component: CNavItem,
            name: 'Equipment Type',
            to: '/equipment_type',
          },
          {
            component: CNavItem,
            name: 'Report Type',
            to: '/report_type',
          },
          {
            component: CNavItem,
            name: 'Control Number',
            to: '/control_number',
          },
        ],
      },
    ]
  }
  return items
}

export default _nav
