import React, { useState, useEffect, useCallback } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CCard, CCardBody } from '@coreui/react'
import MonthlyReport from './MonthlyReport'
import PageTitle from 'src/components/PageTitle'
import FuelPumpDispenseSummary from './FuelPumpDispenseSummary'
import FuelConsumptionReport from './FuelConsumptionReport'

const Report = ({ cardTitle }) => {
  const [activeKey, setActiveKey] = useState(4)

  return (
    <>
      <ToastContainer />

      <PageTitle pageTitle={cardTitle} />
      <CCard className="mb-4">
        <CCardBody>
          <CNav variant="tabs" layout="justified">
            <CNavItem role="presentation">
              <CNavLink
                active={activeKey === 1}
                component="button"
                role="tab"
                aria-controls="tab-1"
                aria-selected={activeKey === 1}
                onClick={() => {
                  setActiveKey(1)
                  toast.dismiss()
                }}
              >
                Monthly Report
              </CNavLink>
            </CNavItem>

            <CNavItem role="presentation">
              <CNavLink
                active={activeKey === 3}
                component="button"
                role="tab"
                aria-controls="tab-3"
                aria-selected={activeKey === 3}
                onClick={() => {
                  setActiveKey(3)
                  toast.dismiss()
                }}
              >
                Fuel Consumption Report
              </CNavLink>
            </CNavItem>
            <CNavItem role="presentation">
              <CNavLink
                active={activeKey === 4}
                component="button"
                role="tab"
                aria-controls="tab-4"
                aria-selected={activeKey === 4}
                onClick={() => {
                  setActiveKey(4)
                  toast.dismiss()
                }}
              >
                Fuel Pump Dispense Summary
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane
              role="tabpanel"
              aria-labelledby="tab-1"
              visible={activeKey === 1}
              style={{ position: 'relative' }}
            >
              <MonthlyReport />
            </CTabPane>
            <CTabPane
              role="tabpanel"
              aria-labelledby="tab-2"
              visible={activeKey === 2}
              style={{ position: 'relative' }}
            >
              2
            </CTabPane>
            <CTabPane
              role="tabpanel"
              aria-labelledby="tab-3"
              visible={activeKey === 3}
              style={{ position: 'relative' }}
            >
              <FuelConsumptionReport />
            </CTabPane>
            <CTabPane
              role="tabpanel"
              aria-labelledby="tab-4"
              visible={activeKey === 4}
              style={{ position: 'relative' }}
            >
              <FuelPumpDispenseSummary />
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Report
