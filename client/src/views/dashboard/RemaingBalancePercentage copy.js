import React from 'react'

import LiquidChart from 'react-liquidchart'
import './../../assets/css/widget.css'
import { Skeleton } from '@mui/material'
import 'animate.css'
import 'intro.js/introjs.css'
import { CCol, CRow } from '@coreui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from 'src/components/SystemConfiguration'
const stops = [
  <stop key={1} stopColor="red" offset="5%" />,
  <stop key={2} stopColor="#1c6dc9" offset="50%" />,
  <stop key={3} stopColor="#4099ff" offset="85%" />,
]
const RemaingBalancePercentage = () => {
  const remainingBalance = useQuery({
    queryFn: async () =>
      await api.get('transaction/remaining_balance').then((response) => {
        return response.data
      }),
    queryKey: ['remainingBalance'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })
  return (
    <>
      <h6>Remaining Balance (L)</h6>
      <CRow>
        {remainingBalance?.isLoading
          ? [...Array(3)].map((_, index) => (
              <CCol key={index}>
                <Skeleton
                  style={{ marginBottom: '20px' }}
                  variant="rounded"
                  height={120}
                  width={'100%'}
                />
              </CCol>
            ))
          : remainingBalance?.data?.map((item, index) => (
              <React.Fragment key={index}>
                <CCol md={4}>
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                    }}
                  >
                    <LiquidChart
                      responsive
                      legend={item.product}
                      value={item.percentage_balance}
                      showDecimal
                      amplitude={10}
                      frequency={2}
                      animationTime={1000}
                      animationWavesTime={2250}
                      outerStyle={{ fill: item.outerStyle }}
                      liquidStyle={{ fill: item.liquidStyle }}
                      dryStyle={{ fill: item.dryStyle }}
                      wetStyle={{ fill: item.wetStyle }}
                      gradient={{
                        type: 1,
                        x1: '200%',
                        y1: '0%',
                        x2: '0%',
                        y2: '100%',
                        gradientUnits: 'userSpaceOnUse',
                        stops,
                      }}
                      postfix="%"
                      legendFontSize={20}
                      fontSizes={{
                        value: 0.3,
                        decimal: 0.3,
                        postfix: 0.3,
                        legend: 0.2,
                      }}
                    />
                  </div>
                </CCol>
              </React.Fragment>
            ))}
      </CRow>
    </>
  )
}

export default RemaingBalancePercentage
