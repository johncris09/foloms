import React from 'react'
import './../../assets/css/widget.css'
import { Card, Skeleton } from '@mui/material'
import 'animate.css'
import 'intro.js/introjs.css'
import {
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const TopDriverConsumption = ({ topDriverConsumption }) => {
  return (
    <Card>
      <CCardBody className="p-2">
        <CTable caption="top" responsive>
          <CTableCaption>
            <h6>Top Driver Fuel Consumption Report</h6>
          </CTableCaption>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Driver&apos;s Name</CTableHeaderCell>
              <CTableHeaderCell>Diesel</CTableHeaderCell>
              <CTableHeaderCell>Premium</CTableHeaderCell>
              <CTableHeaderCell>Regular</CTableHeaderCell>
              <CTableHeaderCell>Total</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {topDriverConsumption?.isLoading
              ? [...Array(10)].map((_, IndexCol) => (
                  <CTableRow key={IndexCol}>
                    <CTableDataCell>
                      <Skeleton
                        variant="rounded"
                        width={'120%'}
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.11)', margin: 'auto' }}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <Skeleton
                        variant="rounded"
                        width={'30%'}
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.11)', margin: 'auto' }}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <Skeleton
                        variant="rounded"
                        width={'30%'}
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.11)', margin: 'auto' }}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <Skeleton
                        variant="rounded"
                        width={'30%'}
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.11)', margin: 'auto' }}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <Skeleton
                        variant="rounded"
                        width={'30%'}
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.11)', margin: 'auto' }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))
              : topDriverConsumption?.data?.map((item, index) => {
                  return (
                    <CTableRow key={index}>
                      <CTableDataCell>{item.driver}</CTableDataCell>
                      <CTableDataCell>{item.diesel}</CTableDataCell>
                      <CTableDataCell>{item.premium}</CTableDataCell>
                      <CTableDataCell>{item.regular}</CTableDataCell>
                      <CTableDataCell>{item.total}</CTableDataCell>
                    </CTableRow>
                  )
                })}
          </CTableBody>
        </CTable>
      </CCardBody>
    </Card>
  )
}

export default TopDriverConsumption
