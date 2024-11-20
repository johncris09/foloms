import React from 'react'
import './../../assets/css/widget.css'
import { Card, Skeleton } from '@mui/material'
import 'animate.css'
import 'intro.js/introjs.css'
import {
  CButton,
  CCardBody,
  CCol,
  CForm,
  CFormSelect,
  CInputGroup,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, currentYear, months } from 'src/components/SystemConfiguration'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'

const TransactionDetails = () => {
  const queryClient = useQueryClient()
  const transactionData = useQuery({
    queryFn: async () =>
      await api.get('transaction').then((response) => {
        return response.data
      }),
    queryKey: ['transactionData'],
    staleTime: Infinity,
    // refetchInterval: 1000,
  })

  const filter = useFormik({
    initialValues: {
      month: '',
      year: '',
    },
    onSubmit: async (values) => {
      await filterSummaryConsumption.mutate(values)
    },
  })

  const filterSummaryConsumption = useMutation({
    mutationKey: ['filterTransaction'],
    mutationFn: async (values) => {
      const response = await api.get('transaction/filter', {
        params: values,
      })
      return response
    },
    onSuccess: async (response) => {
      await queryClient.setQueryData(['transactionData'], response.data)
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const startYear = 2024
  // const currentYear = new Date().getFullYear()
  const years = []

  for (let year = startYear; year <= currentYear + 1; year++) {
    years.push(year)
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    filter.setFieldValue(name, value)
  }

  const removeFilter = () => {
    queryClient.invalidateQueries({ queryKey: ['transactionData'] })
  }

  return (
    <Card responsive className="table-striped">
      <CCardBody className="p-2">
        <div className="d-flex justify-content-between">
          <div>
            <h6>Transaction Details</h6>
          </div>

          <CForm className="d-none d-lg-flex" onSubmit={filter.handleSubmit}>
            <CRow>
              <CCol md>
                <CInputGroup className="mb-3">
                  <CFormSelect size="sm" name="month" onChange={handleInputChange} required>
                    <option value="">Month</option>
                    {months.map((month, index) => (
                      <option key={index} value={month.number}>
                        {month.name}
                      </option>
                    ))}
                  </CFormSelect>
                  <CFormSelect size="sm" name="year" onChange={handleInputChange} required>
                    <option value="">Year</option>
                    {years.map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                  </CFormSelect>
                  <CButton
                    type="submit"
                    disabled={filterSummaryConsumption.isPending}
                    size="sm"
                    variant="outline"
                    color="primary"
                    title="Filter Transaction"
                  >
                    <FontAwesomeIcon icon={faFilter} size="xs" />
                    {filterSummaryConsumption.isPending ? 'Please Wait...' : 'Filter'}
                  </CButton>
                  <CButton
                    type="button"
                    size="sm"
                    variant="outline"
                    color="danger"
                    title="Clear Filter"
                    onClick={removeFilter}
                  >
                    <FontAwesomeIcon icon={faTimes} size="xs" />
                    Clear
                  </CButton>
                </CInputGroup>
              </CCol>
            </CRow>
          </CForm>
        </div>
        <div className="overflow-auto" style={{ maxHeight: '550px' }}>
          <CTable responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell rowSpan={2}>Date</CTableHeaderCell>
                <CTableHeaderCell className="text-center transaction-bg-blue " colSpan={3}>
                  Diesel
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center transaction-bg-green" colSpan={3}>
                  Regular
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center  transaction-bg-yellow" colSpan={3}>
                  Premium
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
              {transactionData?.isLoading || filterSummaryConsumption.isPending
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
        </div>
      </CCardBody>
    </Card>
  )
}

export default TransactionDetails
