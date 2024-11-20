import React from 'react'
import './../../assets/css/widget.css'
import 'animate.css'
import 'intro.js/introjs.css'
import { jwtDecode } from 'jwt-decode'
import PageTitle from 'src/components/PageTitle'
import TopOfficeConsumption from './TopOfficeConsumption'
import TotalConsumption from './TotalConsumption'
import { CCol, CRow } from '@coreui/react'
import TopDriverConsumption from './TopDriverConsumption'
import TopEquipmentConsumption from './TopEquipmentConsumption'
import OverallView from './OverallView'
import TransactionDetails from './TransactionDetails'
import TripTicketUserWork from './TripTicketUserWork'
import OldTripTicketUserWork from './OldTripTicketUserWork'
import RemainingBalancePercentage from './RemainingBalancePercentage'

const Dashboard = ({ cardTitle }) => {
  const user = jwtDecode(localStorage.getItem('folomsToken'))

  return (
    <>
      <PageTitle pageTitle={cardTitle} />

      <p>Welcome {user.first_name},</p>

      <RemainingBalancePercentage />
      {/* <RemaingBalance remainingBalance={remainingBalance} />

      <TotalDelivery totalDelivery={totalDelivery} /> */}
      <TotalConsumption />
      <OverallView />

      <CRow className="my-3">
        <CCol md={12}>{/* <TransactionDetails /> */}</CCol>
      </CRow>

      <CRow className="my-1">
        <CCol md={6}>
          <TripTicketUserWork />
        </CCol>
        <CCol md={6}>
          <OldTripTicketUserWork />
        </CCol>
      </CRow>

      <CRow className="mt-2">
        <CCol md={6}>
          <TopOfficeConsumption />
        </CCol>
        <CCol md={6}>
          <TopDriverConsumption />
        </CCol>
      </CRow>
      <CRow>
        <CCol md={6}>
          <TopEquipmentConsumption />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
