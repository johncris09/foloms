import React from 'react'
import './../../assets/css/widget.css'
import { Skeleton } from '@mui/material'
import 'animate.css'
import 'intro.js/introjs.css'
import { CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGasPump, faPesoSign } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from 'src/components/SystemConfiguration'

const TotalConsumption = () => {
  const totalConsumption = useQuery({
    queryFn: async () =>
      await api.get('product/total_consumption').then((response) => {
        return response.data
      }),
    queryKey: ['totalConsumption'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })
  return (
    <>
      <h6>Total Consumption (L)</h6>
      <CRow>
        {totalConsumption?.isLoading
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
          : totalConsumption?.data?.map((item, index) => {
              return (
                <CCol key={index}>
                  <div className={item.classname + ' card order-card'}>
                    <div className="card-block">
                      <h5>{item.product}</h5>

                      <h2 className="m-b-0">
                        <FontAwesomeIcon className="f-left" icon={faGasPump} />
                        <span className="f-right">{item.total_consumption}</span>
                      </h2>
                    </div>
                  </div>
                </CCol>
              )
            })}
      </CRow>
    </>
  )
}

export default TotalConsumption
