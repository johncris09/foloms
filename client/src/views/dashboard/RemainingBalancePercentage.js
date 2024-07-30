import React from 'react'
import LiquidFillGauge from 'react-liquid-gauge'
import './../../assets/css/widget.css'
import { Skeleton } from '@mui/material'
import 'intro.js/introjs.css'
import { CCol, CRow } from '@coreui/react'
import { useQuery } from '@tanstack/react-query'
import { api } from 'src/components/SystemConfiguration'
import { color } from 'd3-color'
const RemainingBalancePercentage = () => {
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
                  style={{ margin: '0 auto' }}
                  variant="circular"
                  height={210}
                  width={210}
                />
              </CCol>
            ))
          : remainingBalance?.data?.map((item, index) => (
              <React.Fragment key={index}>
                <CCol md={4}>
                  {/* <div
                    style={{
                      width: '100%',
                      height: '200px',
                    }}
                  > */}
                  <div className="text-center">
                    <p className="h6">{item.product}</p>
                  </div>
                  <LiquidFillGauge
                    style={{ margin: '0 auto' }}
                    width={200}
                    height={200}
                    value={item.percentage_balance}
                    percent="%"
                    textSize={1}
                    textOffsetX={0}
                    textOffsetY={0}
                    textRenderer={({ value, width, height, textSize, percent }) => {
                      value = Math.round(value)
                      const radius = Math.min(height / 2, width / 2)
                      const textPixels = (textSize * radius) / 2
                      const valueStyle = {
                        fontSize: textPixels,
                      }
                      const percentStyle = {
                        fontSize: textPixels * 0.6,
                      }

                      return (
                        <tspan>
                          <tspan className="value" style={valueStyle}>
                            {value}
                          </tspan>
                          <tspan style={percentStyle}>{percent}</tspan>
                        </tspan>
                      )
                    }}
                    riseAnimation
                    waveAnimation
                    waveFrequency={2}
                    waveAmplitude={2}
                    gradient
                    gradientStops={[
                      {
                        key: '0%',
                        stopColor: color(item.liquidStyle).darker(0.5).toString(),
                        stopOpacity: 1,
                        offset: '0%',
                      },
                      {
                        key: '50%',
                        stopColor: item.liquidStyle,
                        stopOpacity: 0.75,
                        offset: '50%',
                      },
                      {
                        key: '100%',
                        stopColor: color(item.liquidStyle).brighter(1).toString(),
                        stopOpacity: 0.5,
                        offset: '100%',
                      },
                    ]}
                    circleStyle={{
                      fill: item.outerStyle,
                    }}
                    waveStyle={{
                      fill: item.liquidStyle,
                    }}
                    textStyle={{
                      fill: color('#444').toString(),
                      fontFamily: 'Arial',
                    }}
                    waveTextStyle={{
                      fill: color('#fff').toString(),
                      fontFamily: 'Arial',
                    }}
                  />
                  {/* </div> */}
                </CCol>
              </React.Fragment>
            ))}
      </CRow>
    </>
  )
}

export default RemainingBalancePercentage
