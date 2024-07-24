import { cilFilter } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButtonGroup,
  CCard,
  CCardBody,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { Skeleton } from '@mui/material'
import React from 'react'
import ApexCharts from 'react-apexcharts'
import { api, months } from 'src/components/SystemConfiguration'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const TopOfficeConsumption = () => {
  const topOfficeConsumption = useQuery({
    queryFn: async () =>
      await api.get('office/top_consumption').then((response) => {
        return response.data
      }),
    queryKey: ['topOfficeConsumption'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })
  return (
    <>
      <CCard>
        <CCardBody>
          <div className="d-flex justify-content-between">
            <div>
              <h6>Top Office Fuel Consumption Report</h6>{' '}
            </div>
          </div>

          {topOfficeConsumption.isLoading ? (
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
                  categories: !topOfficeConsumption.isLoading
                    ? topOfficeConsumption?.data?.categories
                    : [],
                },
              }}
              series={!topOfficeConsumption.isLoading ? topOfficeConsumption?.data?.series : []}
              type="bar"
              height={400}
            />
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default TopOfficeConsumption
