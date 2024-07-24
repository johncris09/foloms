import React from 'react'
import './../../assets/css/widget.css'
import { Card, Skeleton } from '@mui/material'
import 'animate.css'
import 'intro.js/introjs.css'
import {
  CCardBody,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from 'src/components/SystemConfiguration'

const TransactionDetails = () => {
  const transactionData = useQuery({
    queryFn: async () =>
      await api.get('transaction').then((response) => {
        return response.data
      }),
    queryKey: ['transactionData'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  return (
    <Card responsive className="table-striped">
      <CCardBody className="p-2">
        <CTable caption="top" responsive>
          <CTableCaption>
            <div className="d-flex justify-content-between">
              <div>
                <h6>Transaction Details</h6>
              </div>
            </div>
          </CTableCaption>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell rowSpan={2}>Date</CTableHeaderCell>
              <CTableHeaderCell className="text-center transaction-bg-blue " colSpan={3}>
                Diesel
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center transaction-bg-green" colSpan={3}>
                Premium
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center  transaction-bg-yellow" colSpan={3}>
                Regular
              </CTableHeaderCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Delivery</CTableHeaderCell>
              <CTableHeaderCell>Consumed</CTableHeaderCell>
              <CTableHeaderCell>Balanced</CTableHeaderCell>
              <CTableHeaderCell>Delivery</CTableHeaderCell>
              <CTableHeaderCell>Consumed</CTableHeaderCell>
              <CTableHeaderCell>Balanced</CTableHeaderCell>
              <CTableHeaderCell>Delivery</CTableHeaderCell>
              <CTableHeaderCell>Consumed</CTableHeaderCell>
              <CTableHeaderCell>Balanced</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {transactionData?.isLoading
              ? [...Array(5)].map((_, IndexCol) => (
                  <CTableRow key={IndexCol}>
                    {[...Array(10)].map((_, indexCell) => (
                      <CTableDataCell key={indexCell}>
                        <Skeleton variant="rounded" width={'100%'} />
                      </CTableDataCell>
                    ))}
                  </CTableRow>
                ))
              : transactionData?.data?.map((item, index) => {
                  return (
                    <CTableRow key={index}>
                      <CTableDataCell>{item.date}</CTableDataCell>
                      <CTableDataCell className={item.diesel_delivery > 0 && 'text-primary h6'}>
                        {item.diesel_delivery}
                      </CTableDataCell>
                      <CTableDataCell>{item.diesel_consumption}</CTableDataCell>
                      <CTableDataCell className="text-danger h6">
                        {item.diesel_balance}
                      </CTableDataCell>
                      <CTableDataCell className={item.regular_delivery > 0 && 'text-primary h6'}>
                        {item.regular_delivery}
                      </CTableDataCell>
                      <CTableDataCell>{item.regular_consumption}</CTableDataCell>
                      <CTableDataCell className="text-danger h6">
                        {item.regular_balance}
                      </CTableDataCell>
                      <CTableDataCell className={item.premium_delivery > 0 && 'text-primary h6'}>
                        {item.premium_delivery}
                      </CTableDataCell>
                      <CTableDataCell>{item.premium_consumption}</CTableDataCell>
                      <CTableDataCell className="text-danger h6">
                        {item.premium_balance}
                      </CTableDataCell>
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

export default TransactionDetails
