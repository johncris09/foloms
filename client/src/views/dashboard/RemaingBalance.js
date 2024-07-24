import React from 'react'
import './../../assets/css/widget.css'
import { Skeleton } from '@mui/material'
import 'animate.css'
import 'intro.js/introjs.css'
import { CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGasPump, faPesoSign } from '@fortawesome/free-solid-svg-icons'

const RemaingBalance = ({ remainingBalance }) => {
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
          : remainingBalance?.data?.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <CCol md={4}>
                    <div className={item.classname + ' card order-card'}>
                      <div className="card-block">
                        <h5>{item.product}</h5>

                        <h2 className="m-b-0">
                          <FontAwesomeIcon className="f-left" icon={faGasPump} />
                          <span className="f-right">{item.balance}</span>
                        </h2>
                      </div>
                    </div>
                  </CCol>
                </React.Fragment>
              )
            })}
      </CRow>
    </>
  )
}

export default RemaingBalance
