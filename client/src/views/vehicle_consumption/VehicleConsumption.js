import React, { useState, useRef } from 'react'
import { ExportToCsv } from 'export-to-csv'
import Swal from 'sweetalert2'
import 'cropperjs/dist/cropper.css'
import {
  CButton,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormText,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import { MaterialReactTable } from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  requiredField,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PageTitle from 'src/components/PageTitle'

const VehicleConsumption = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const equipmentOfficeInputRef = useRef()
  const equipmentTypeInputRef = useRef()
  const reportTypeInputRef = useRef()
  const [modalVisible, setModalVisible] = useState(false)
  const column = [
    {
      accessorKey: 'model',
      header: 'Model',
    },
    {
      accessorKey: 'plate_number',
      header: 'Plate #',
    },
    {
      accessorKey: 'total_purchased',
      header: 'Total Purchased',
    },
  ]

  const vehicleConsumption = useQuery({
    queryFn: async () =>
      await api.get('vehicle_consumption').then((response) => {
        return response.data
      }),
    queryKey: ['vehicleConsumption'],
    staleTime: Infinity,
  })

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: column.map((c) => c.header),
  }

  const csvExporter = new ExportToCsv(csvOptions)

  const handleExportData = () => {
    const exportedData =
      !vehicleConsumption.isLoading &&
      vehicleConsumption.data.map((item) => {
        return {
          Model: item.model,
          'Plate #': item.plate_number,
          'Total Purchased': item.total_purchased,
        }
      })
    csvExporter.generateCsv(exportedData)
  }
  const handleExportRows = (rows) => {
    const exportedData = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          Model: item.model,
          'Plate #': item.plate_number,
          'Total Purchased': item.total_purchased,
        }
      })

    csvExporter.generateCsv(exportedData)
  }
  return (
    <>
      <ToastContainer />

      <PageTitle pageTitle={cardTitle} />
      <MaterialReactTable
        columns={column}
        data={!vehicleConsumption.isLoading && vehicleConsumption.data}
        state={{
          isLoading: vehicleConsumption.isLoading,
          isSaving: vehicleConsumption.isLoading,
          showLoadingOverlay: vehicleConsumption.isLoading,
          showProgressBars: vehicleConsumption.isLoading,
          showSkeletons: vehicleConsumption.isLoading,
        }}
        muiCircularProgressProps={{
          color: 'secondary',
          thickness: 5,
          size: 55,
        }}
        muiSkeletonProps={{
          animation: 'pulse',
          height: 28,
        }}
        enableRowSelection
        enableSelectAll={true}
        enableGrouping
        columnFilterDisplayMode="popover"
        paginationDisplayMode="pages"
        positionToolbarAlertBanner="bottom"
        enableStickyHeader
        enableStickyFooter
        // enableRowActions
        initialState={{
          density: 'compact',
          columnPinning: { left: ['mrt-row-actions'] },
        }}
        renderTopToolbarCustomActions={({ row, table }) => (
          <Box
            className="d-none d-lg-flex"
            sx={{
              display: 'flex',
              gap: '.2rem',
              p: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <CButton className="btn-info text-white" onClick={handleExportData} size="sm">
              <FontAwesomeIcon icon={faFileExcel} /> Export All
            </CButton>

            <CButton
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
              size="sm"
              onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
              variant="outline"
            >
              <FontAwesomeIcon icon={faFileExcel} /> Export Selected Rows
            </CButton>
          </Box>
        )}
      />
    </>
  )
}

export default VehicleConsumption
