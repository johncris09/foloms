import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import MonthlyReport from './MonthlyReport'
import FuelPumpDispenseSummary from './FuelPumpDispenseSummary'
import FuelConsumptionReport from './FuelConsumptionReport'
import VehicleMonthlyReport from './VehicleMonthlyReport'

const TripTicketReportNav = ({ cardTitle }) => {
  const [activeKey, setActiveKey] = useState(1)

  return (
    <>
      <CNav variant="tabs" layout="justified" className="mt-4">
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
            active={activeKey === 2}
            component="button"
            role="tab"
            aria-controls="tab-2"
            aria-selected={activeKey === 2}
            onClick={() => {
              setActiveKey(2)
              toast.dismiss()
            }}
          >
            Fuel Consumption Report
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
            Fuel Pump Dispense Summary
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
            Vehicle Monthly Report
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
          <hr />
          <MonthlyReport />
        </CTabPane>
        <CTabPane
          role="tabpanel"
          aria-labelledby="tab-2"
          visible={activeKey === 2}
          style={{ position: 'relative' }}
        >
          <hr />
          <FuelConsumptionReport />
        </CTabPane>
        <CTabPane
          role="tabpanel"
          aria-labelledby="tab-3"
          visible={activeKey === 3}
          style={{ position: 'relative' }}
        >
          <hr />
          <FuelPumpDispenseSummary />
        </CTabPane>
        <CTabPane
          role="tabpanel"
          aria-labelledby="tab-4"
          visible={activeKey === 4}
          style={{ position: 'relative' }}
        >
          <hr />
          <VehicleMonthlyReport />
        </CTabPane>
      </CTabContent>
    </>
  )
}

export default TripTicketReportNav
