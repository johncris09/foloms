import React from 'react'
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCol,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormSelect,
  CInputGroup,
  CRow,
} from '@coreui/react'
import { Skeleton } from '@mui/material'
import ApexCharts from 'react-apexcharts'
import { api, months } from 'src/components/SystemConfiguration'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons'
import CIcon from '@coreui/icons-react'
import { cilFilter } from '@coreui/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const TripTicketUserWork = () => {
  const queryClient = useQueryClient()
  const tripTicketWorkTrend = useQuery({
    queryFn: async () =>
      await api.get('trip_ticket/work_trend').then((response) => {
        return response.data
      }),
    queryKey: ['tripTicketWorkTrend'],
    staleTime: Infinity,
    // refetchInterval: 1000,
  })

  const filter = useMutation({
    mutationKey: ['filterTripTicketWorkTrend'],
    mutationFn: async (values) => {
      const response = await api.get('trip_ticket/work_trend', {
        params: values,
      })
      return response
    },
    onSuccess: async (response) => {
      await queryClient.setQueryData(['tripTicketWorkTrend'], response.data)
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const handleSubmit = async (event, data) => {
    await filter.mutate(data)
  }

  const getCurrentMonthNumber = () => {
    const date = new Date()
    return date.getMonth() + 1 // getMonth() returns 0-based index, so add 1
  }

  const currentMonthNumber = getCurrentMonthNumber()

  return (
    <>
      <CCard>
        <CCardBody>
          <div className="d-flex justify-content-between">
            <div>
              <p className="h6">Monitor User&apos;s Work (Trip Ticket)</p>
            </div>
            <div style={{ marginTop: -10 }}>
              <CButtonGroup>
                <CDropdown>
                  <CDropdownToggle color="transparent" variant="outline" caret={false}>
                    <CIcon icon={cilFilter} />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem onClick={(e) => handleSubmit(e, { month: currentMonthNumber })}>
                      This Month
                    </CDropdownItem>

                    <CDropdownDivider />
                    {months.map((month, index) => (
                      <CDropdownItem
                        key={index}
                        onClick={(e) => handleSubmit(e, { month: month.number })}
                      >
                        {month.name}
                      </CDropdownItem>
                    ))}

                    <CDropdownDivider />
                    {/* <CDropdownItem onClick={(e) => handleSubmit(e, { filter_by: 'year' })}>
                      Clear Filter
                    </CDropdownItem> */}
                  </CDropdownMenu>
                </CDropdown>
              </CButtonGroup>
            </div>
          </div>

          {tripTicketWorkTrend.isLoading ? (
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
                  type: 'area',
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

                fill: {
                  type: 'gradient',
                  gradient: {
                    enabled: true,
                    opacityFrom: 0.55,
                    opacityTo: 0,
                  },
                  // gradient: {
                  //   shadeIntensity: 1,
                  //   opacityFrom: 0.7,
                  //   opacityTo: 0.9,
                  //   stops: [0, 90, 100],
                  // },
                },
                xaxis: {
                  categories: !tripTicketWorkTrend.isLoading
                    ? tripTicketWorkTrend?.data?.categories
                    : [],
                },
              }}
              series={!tripTicketWorkTrend.isLoading ? tripTicketWorkTrend?.data?.series : []}
              type="area"
              height={400}
            />
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default TripTicketUserWork
