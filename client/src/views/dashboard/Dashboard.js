import React from 'react'
import './../../assets/css/widget.css'
import 'animate.css'
import 'intro.js/introjs.css'
import { jwtDecode } from 'jwt-decode'
import PageTitle from 'src/components/PageTitle'
import { api } from 'src/components/SystemConfiguration'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import TopOfficeConsumption from './TopOfficeConsumption'
import TotalConsumption from './TotalConsumption'
import { CCol, CRow } from '@coreui/react'
import TopDriverConsumption from './TopDriverConsumption'
import TopEquipmentConsumption from './TopEquipmentConsumption'
import OverallView from './OverallView'

const Dashboard = ({ cardTitle }) => {
  const user = jwtDecode(localStorage.getItem('folomsToken'))
  const [
    totalConsumption,
    topOfficeConsumption,
    topDriverConsumption,
    topEquipmentConsumption,
    productConsumptionTrend,
  ] = useQueries({
    queries: [
      {
        queryKey: ['totalConsumption'],
        queryFn: () => api.get('product/total_consumption').then((response) => response.data),
      },
      {
        queryKey: ['topOfficeConsumption'],
        queryFn: () => api.get('office/top_consumption').then((response) => response.data),
      },
      {
        queryKey: ['topDriverConsumption'],
        queryFn: () => api.get('driver/top_consumption').then((response) => response.data),
      },
      {
        queryKey: ['topEquipmentConsumption'],
        queryFn: () => api.get('equipment/top_consumption').then((response) => response.data),
      },

      {
        queryKey: ['productConsumptionTrend'],
        queryFn: () =>
          api.get('trip_ticket/product_consumption_trend').then((response) => response.data),
      },
    ],
  })
  return (
    <>
      <PageTitle pageTitle={cardTitle} />

      <p>Welcome {user.first_name}</p>

      <TotalConsumption totalConsumption={totalConsumption} />
      <OverallView productConsumptionTrend={productConsumptionTrend} />
      <CRow>
        <CCol md={6}>
          <TopOfficeConsumption topOfficeConsumption={topOfficeConsumption} />
        </CCol>
        <CCol md={6}>
          <TopDriverConsumption topDriverConsumption={topDriverConsumption} />
        </CCol>
      </CRow>
      <CRow className="mt-3">
        <CCol md={6}>
          <TopEquipmentConsumption topEquipmentConsumption={topEquipmentConsumption} />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
