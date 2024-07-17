import React from 'react'

const Profile = React.lazy(() => import('./views/profile/Profile'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const TripTicket = React.lazy(() => import('./views/trip_ticket/TripTicket'))
const OldTripTicket = React.lazy(() => import('./views/old_trip_ticket/OldTripTicket'))
const Equipment = React.lazy(() => import('./views/equipment/Equipment'))
const EquipmentType = React.lazy(() => import('./views/equipment_type/EquipmentType'))
const ReportType = React.lazy(() => import('./views/report_type/ReportType'))
const Driver = React.lazy(() => import('./views/driver/Driver'))
const Office = React.lazy(() => import('./views/office/Office'))
const Product = React.lazy(() => import('./views/product/Product'))
const User = React.lazy(() => import('./views/user/User'))
const MonthlyReport = React.lazy(() => import('./views/report/MonthlyReport'))
const Report = React.lazy(() => import('./views/report/Report'))
const SummaryConsumption = React.lazy(() => import('./views/report/SummaryConsumption'))
const ControlNumber = React.lazy(() => import('./views/control_number/ControlNumber'))

const routes = [
  {
    path: '/dashboard',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'Dashboard',
    element: Dashboard,
  },
  {
    path: '/report',
    user: ['Super Admin', 'Admin'],
    name: 'Report',
    element: Report,
  },

  {
    path: '/report/monthly_report',
    user: ['Super Admin', 'Admin'],
    name: 'Monthly Report',
    element: MonthlyReport,
  },

  {
    path: '/report/summary_consumption',
    user: ['Super Admin', 'Admin'],
    name: 'Summary Consumption',
    element: SummaryConsumption,
  },

  {
    path: '/trip_ticket',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'Trip Ticket',
    element: TripTicket,
  },
  {
    path: '/old_trip_ticket',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'Old Trip Ticket',
    element: OldTripTicket,
  },
  {
    path: '/equipment',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'Equipment',
    element: Equipment,
  },
  {
    path: '/driver',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'Driver',
    element: Driver,
  },
  {
    path: '/office',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'Office',
    element: Office,
  },
  { path: '/product', user: ['Super Admin'], name: 'Product', element: Product },
  {
    path: '/control_number',
    user: ['Super Admin'],
    name: 'Control Number',
    element: ControlNumber,
  },
  {
    path: '/equipment_type',
    user: ['Super Admin'],
    name: 'Equipment Type',
    element: EquipmentType,
  },
  {
    path: '/report_type',
    user: ['Super Admin'],
    name: 'Report Type',
    element: ReportType,
  },
  { path: '/user', user: ['Super Admin'], name: 'User', element: User },
  { path: '/profile', user: ['Super Admin'], name: 'Profile', element: Profile },
]

export default routes
