import React, { useState, useRef } from 'react'

import {
  CCardBody,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
  Svg,
  Line,
} from '@react-pdf/renderer'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'
import { format, parse } from 'date-fns'
import { api, requiredField } from 'src/components/SystemConfiguration'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { CDatePicker } from '@coreui/react-pro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { jwtDecode } from 'jwt-decode'
const BORDER_COLOR = '#bfbfbf'
const BORDER_STYLE = 'solid'
const NUM_COLUMNS = 12
const COL1_WIDTH = 10
const COLN_WIDTH = (100 - 12) / (NUM_COLUMNS - 3)

// const COLN_WIDTH = (100 - NUM_COLUMNS) / 3

export default function EquipmentMonthlyReport() {
  const [selectedEquipment, setSelectedEquipment] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())

  const {
    data: reportData,
    isLoading,
    error,
  } = useQuery({
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('year', year)
      if (selectedEquipment) {
        params.append('equipment', selectedEquipment)
      }
      const { data } = await api.get(`equipment/monthly_report?${params.toString()}`)
      return data
    },
    queryKey: ['equipmentMonthlyReport', selectedEquipment, year],
    staleTime: Infinity,
  })

  const { data: equipmentList } = useQuery({
    queryFn: async () => {
      const { data } = await api.get('equipment') // equipment list for dropdown

      return data
    },
    queryKey: ['equipment'],
    staleTime: Infinity,
  })

  if (isLoading) return <p>Loading report...</p>
  if (error) return <p>Error loading report.</p>

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Equipment Monthly Report</h2>

      {/* Filters */}
      <div style={{ marginBottom: '1rem' }}>
        <CFormLabel>
          Year:
          <CFormSelect
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ marginLeft: '0.5rem', width: '6rem' }}
          >
            {Array.from({ length: new Date().getFullYear() - 2023 + 1 }, (_, i) => {
              const y = 2023 + i
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              )
            })}
          </CFormSelect>
        </CFormLabel>

        <CFormLabel style={{ marginLeft: '1rem' }}>
          Equipment:
          <CFormSelect
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="">All</option>
            {equipmentList?.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.model} ({eq.plate_number})
              </option>
            ))}
          </CFormSelect>
        </CFormLabel>
      </div>

      {/* Report */}
      {reportData?.map((equip) => (
        <div key={equip.id} style={{ marginBottom: '2rem' }}>
          <h3>
            {equip.model} ({equip.plate_number})
          </h3>
          <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.5rem' }}>
            <div>
              <strong>Office:</strong> {equip.abbr}
            </div>
            <div>
              <strong>Fuel Capacity:</strong> {equip.fuel_capacity} Liters
            </div>
            <div>
              <strong>Equipment Type:</strong> {equip.equipment_type}
            </div>
          </div>
          <CTable caption="top" responsive>
            {/* <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}> */}
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Month</CTableHeaderCell>
                <CTableHeaderCell>Monthly Consumption (L)</CTableHeaderCell>
                <CTableHeaderCell>Monthly Cost</CTableHeaderCell>
                <CTableHeaderCell>Distance Travel (km)</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {equip.monthly_report.map((m, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{m.month}</CTableDataCell>
                  <CTableDataCell>{m.monthly_consumption}</CTableDataCell>
                  <CTableDataCell>{m.monthly_cost}</CTableDataCell>
                  <CTableDataCell>{m.distance_travel}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      ))}
    </div>
  )
}
