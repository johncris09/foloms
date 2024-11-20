import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CCard, CCardBody } from '@coreui/react'
import PageTitle from 'src/components/PageTitle'
import TripTicketReportNav from './trip_ticket/TripTicketReportNav'
import OldTripTicketReportNav from './old_trip_ticket/OldTripTicketReportNav'

const Report = ({ cardTitle }) => {
  const [activeKey, setActiveKey] = useState(1)

  return (
    <>
      <ToastContainer />

      <PageTitle pageTitle={cardTitle} />
      <CCard className="mb-4">
        <CCardBody>
          <CNav variant="pills" role="tablist" className="justify-content-end">
            <CNavItem>
              <CNavLink
                active={activeKey === 1}
                component="button"
                role="tab"
                aria-controls="trip-ticket-tab"
                aria-selected={activeKey === 1}
                onClick={() => {
                  setActiveKey(1)
                  toast.dismiss()
                }}
              >
                Trip Ticket
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeKey === 2}
                component="button"
                role="tab"
                aria-controls="old-trip-ticket-tab"
                aria-selected={activeKey === 2}
                onClick={() => {
                  setActiveKey(2)
                  toast.dismiss()
                }}
              >
                Old Trip Ticket
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane role="tabpanel" aria-labelledby="trip-ticket-tab" visible={activeKey === 1}>
              <hr />
              <TripTicketReportNav />
            </CTabPane>
            <CTabPane
              role="tabpanel"
              aria-labelledby="old-trip-ticket-tab"
              visible={activeKey === 2}
            >
              <hr />
              <OldTripTicketReportNav />
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Report
