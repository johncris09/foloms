import React from 'react'
import { CCard, CCardBody } from '@coreui/react'
import { Skeleton } from '@mui/material'
import ApexCharts from 'react-apexcharts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from 'src/components/SystemConfiguration'

const OldTripTicketUserWork = () => {
  const oldTripTicketWorkTrend = useQuery({
    queryFn: async () =>
      await api.get('old_trip_ticket/work_trend').then((response) => {
        return response.data
      }),
    queryKey: ['oldTripTicketWorkTrend'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })
  return (
    <>
      <CCard>
        <CCardBody>
          <div className="d-flex justify-content-between">
            <div>
              <p className="h6">Monitor User&apos;s Work (Old Trip Ticket)</p>
            </div>
          </div>

          {oldTripTicketWorkTrend.isLoading ? (
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
                  categories: !oldTripTicketWorkTrend.isLoading
                    ? oldTripTicketWorkTrend?.data?.categories
                    : [],
                },
              }}
              series={!oldTripTicketWorkTrend.isLoading ? oldTripTicketWorkTrend?.data?.series : []}
              type="area"
              height={400}
            />
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default OldTripTicketUserWork
