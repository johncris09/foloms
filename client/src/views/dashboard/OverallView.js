import { CCard, CCardBody } from '@coreui/react'
import { Skeleton } from '@mui/material'
import React from 'react'
import ApexCharts from 'react-apexcharts'

const OverallView = ({ productConsumptionTrend }) => {
  console.info(productConsumptionTrend.isLoading)
  return (
    <>
      {productConsumptionTrend.isLoading ? (
        <Skeleton variant="rounded" width={'100%'} height={450} style={{ marginBottom: '30px' }} />
      ) : (
        <CCard>
          <CCardBody>
            <ApexCharts
              options={{
                chart: {
                  type: 'area',
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  width: 3,
                },
                markers: {
                  size: 1,
                  colors: ['blue', 'green', 'orange'],
                  strokeColor: 'gray',
                  strokeWidth: 1,
                },

                grid: {
                  borderColor: '#555',
                  clipMarkers: false,
                  yaxis: {
                    lines: {
                      show: false,
                    },
                  },
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
                  categories: !productConsumptionTrend.isLoading
                    ? productConsumptionTrend?.data?.categories
                    : [],
                },
              }}
              series={
                !productConsumptionTrend.isLoading ? productConsumptionTrend?.data?.series : []
              }
              type="area"
              height={400}
            />
          </CCardBody>
        </CCard>
      )}
    </>
  )
}

export default OverallView
