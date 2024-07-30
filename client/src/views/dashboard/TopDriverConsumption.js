import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormSelect,
  CInputGroup,
  CRow,
} from '@coreui/react'
import { Skeleton } from '@mui/material'
import ApexCharts from 'react-apexcharts'
import { api, currentYear, months } from 'src/components/SystemConfiguration'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons'

const TopDriverConsumption = () => {
  const queryClient = useQueryClient()
  const topDriverConsumption = useQuery({
    queryFn: async () =>
      await api.get('driver/top_consumption').then((response) => {
        return response.data
      }),
    queryKey: ['topDriverConsumption'],
    staleTime: Infinity,
  })

  const filter = useFormik({
    initialValues: {
      top: '',
      month: '',
      year: '',
    },
    onSubmit: async (values) => {
      await filterSummaryConsumption.mutate(values)
    },
  })

  const filterSummaryConsumption = useMutation({
    mutationKey: ['filterTopDriverConsumption'],
    mutationFn: async (values) => {
      const response = await api.get('driver/top_consumption', {
        params: values,
      })
      return response
    },
    onSuccess: async (response) => {
      await queryClient.setQueryData(['topDriverConsumption'], response.data)
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
    queryClient.invalidateQueries({ queryKey: ['topDriverConsumption'] })

    filter.resetForm()
  }
  return (
    <>
      <CCard>
        <CCardBody>
          <div className="d-flex justify-content-between">
            <div>
              <h6>Top Driver Fuel Consumption Report</h6>
            </div>

            <CForm className="d-none d-lg-flex" onSubmit={filter.handleSubmit}>
              <CRow>
                <CCol md>
                  <CInputGroup className="mb-3">
                    <CFormSelect size="sm" name="top" onChange={handleInputChange}>
                      <option value="">Top</option>
                      {Array.from({ length: 5 }, (_, i) => (i + 1) * 10).map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </CFormSelect>
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

          {topDriverConsumption.isLoading ? (
            <Skeleton
              variant="rounded"
              width={'100%'}
              height={390}
              style={{ marginBottom: '30px' }}
            />
          ) : (
            <ApexCharts
              options={{
                chart: {
                  type: 'bar',
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: 'smooth',
                  width: 3,
                },
                markers: {
                  size: 1,
                  colors: ['blue', 'green', 'orange'],
                  strokeColor: 'gray',
                  strokeWidth: 1,
                },
                grid: {
                  show: true, // Enable or disable the grid
                  borderColor: '#e7e7e7', // Set the color of the grid lines
                  strokeDashArray: 0, // Set the style of the grid lines (e.g., dashed lines)
                  position: 'back', // Position the grid lines (e.g., 'back' or 'front')
                },
                xaxis: {
                  categories: !topDriverConsumption.isLoading
                    ? topDriverConsumption?.data?.categories
                    : [],
                },
              }}
              series={!topDriverConsumption.isLoading ? topDriverConsumption?.data?.series : []}
              type="bar"
              height={400}
            />
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default TopDriverConsumption
