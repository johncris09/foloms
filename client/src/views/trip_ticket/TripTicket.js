import React, { useState, useRef } from 'react'
import Swal from 'sweetalert2'
import 'cropperjs/dist/cropper.css'
import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormText,
  CFormTextarea,
  CInputGroup,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faFileExcel, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { AlternateEmailRounded, DeleteOutline, EditSharp, Key } from '@mui/icons-material'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  requiredField,
  roleType,
  toSentenceCase,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const TripTicket = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(true)
  const tripTicketProductInputRef = useRef()
  const tripTicketDriverInputRef = useRef()
  const tripTicketEquipmentInputRef = useRef()
  const [operationLoading, setOperationLoading] = useState(false)
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const [modalChangePasswordFormVisible, setModalChangePasswordFormVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [togglePassword, setTogglePassword] = useState(true)
  const column = [
    {
      accessorKey: 'control_number',
      header: 'Control #',
      accessorFn: (row) => {
        const purchaseDate = row.purchase_date // Assuming the format is YYYY-MM-DD
        let formattedDate = ''

        if (purchaseDate) {
          const [year, month, day] = purchaseDate.split('-')
          if (year && month && day) {
            const formattedYear = year.slice(2) // Get the last two digits of the year
            formattedDate = `${month}-${day}-${formattedYear}`
          }
        }

        const controlNumber = row.control_number || 0
        const formattedControlNumber = String(controlNumber).padStart(4, '0')

        return `${formattedDate ? formattedDate + '-' : ''}${formattedControlNumber}`
      },
    },
    {
      accessorKey: 'purchase_date',
      header: 'Date',
    },
    {
      accessorKey: 'product',
      header: 'Product',
    },
    {
      accessorKey: 'plate_number',
      header: 'Plate #',
    },
    {
      accessorKey: 'model',
      header: 'Model',
    },
    {
      accessorKey: 'driver',
      header: "Driver's Name",
      accessorFn: (row) =>
        `${row.first_name} ${
          row.middle_name
            ? row.middle_name.length === 1
              ? row.middle_name + '.'
              : row.middle_name.substring(0, 1) + '.'
            : ''
        } ${row.last_name} ${row.suffix ? row.suffix : ''}`,
    },
    {
      accessorKey: 'abbr',
      header: 'Office',
    },
    {
      accessorKey: 'authorized_passengers',
      header: 'Authorized Passengers',
    },
    {
      accessorKey: 'places_to_visit',
      header: 'Places to Visit',
    },
    {
      accessorKey: 'departure_time',
      header: 'Departure Time',
    },
    {
      accessorKey: 'arrival_time_at_destination',
      header: 'Arrival Time at Destination',
    },
    {
      accessorKey: 'departure_time_from_destination',
      header: 'Departure Time from Destination',
    },
    {
      accessorKey: 'arrival_time_back',
      header: 'Arrival Time Back',
    },
    {
      accessorKey: 'approximate_distance_traveled',
      header: 'Approximate Distance Traveled',
    },
    {
      accessorKey: 'gasoline_balance_in_tank',
      header: 'Gasoline Balance in Tank',
    },
    {
      accessorKey: 'gasoline_issued_by_office',
      header: 'Gasoline Issued by Office',
    },
    {
      accessorKey: 'gasoline_purchased',
      header: 'Gasoline Purchased',
    },
    {
      accessorKey: 'gasoline_used',
      header: 'Gasoline Used',
    },
    {
      accessorKey: 'gasoline_balance_end_trip',
      header: 'Gasoline Balance End Trip',
    },
    {
      accessorKey: 'gear_oil_issued_purchased',
      header: 'Gear Oil Issued Purchased',
    },
    {
      accessorKey: 'lubricating_oil_issued_purchased',
      header: 'Lubricating Oil Issued Purchased',
    },
    {
      accessorKey: 'grease_issued_purchased',
      header: 'Grease Issued Purchased',
    },
    {
      accessorKey: 'brake_fluid_issued_purchased',
      header: 'Brake Fluid Issued Purchased',
    },
    {
      accessorKey: 'speedometer_start',
      header: 'Speedometer Start',
    },
    {
      accessorKey: 'speedometer_end',
      header: 'Speedometer End',
    },
    {
      accessorKey: 'distance_traveled',
      header: 'Distance Traveled',
    },
    {
      accessorKey: 'purposes',
      header: 'Purposes',
    },
    {
      accessorKey: 'remarks',
      header: 'Remarks',
    },
    {
      accessorKey: 'encoded_at',
      header: 'Encoded at',
    },
  ]

  const tripTicketProduct = useQuery({
    queryFn: async () =>
      await api.get('product').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.product}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['tripTicketProduct'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })
  const tripTicketDriver = useQuery({
    queryFn: async () =>
      await api.get('driver').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.last_name}, ${item.first_name} ${
            item.middle_name
              ? item.middle_name.length === 1
                ? item.middle_name + '.'
                : item.middle_name.substring(0, 1) + '.'
              : ''
          } ${item.suffix ? item.suffix : ''}`
          const job_description = item.job_description ? '' : item.job_description
          return { value, label, job_description }
        })
        return formattedData
      }),
    queryKey: ['tripTicketDriver'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })
  const tripTicketEquipment = useQuery({
    queryFn: async () =>
      await api.get('equipment').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.plate_number} - ${item.model} - ${item.abbr} `
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['tripTicketEquipment'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const tripTicket = useQuery({
    queryFn: async () =>
      await api.get('trip_ticket').then((response) => {
        return response.data
      }),
    queryKey: ['tripTicket'],
    staleTime: Infinity,
  })

  const tripTicketControlNumber = useQuery({
    queryFn: async () =>
      await api.get('last_control_number').then((response) => {
        return response.data
      }),
    queryKey: ['tripTicketControlNumber'],
    staleTime: Infinity,
    refetchInterval: 100,
  })
  const validationSchema = Yup.object().shape({
    purchase_date: Yup.string().required('Date is required'),
    product: Yup.string().required('Product is required'),
    driver: Yup.string().required('Driver is required'),
    equipment: Yup.string().required('Equipment is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      control_number: '',
      purchase_date: '2024-06-19',
      product: '',
      driver: '',
      equipment: '',
      authorized_passengers: '',
      places_to_visit: '',
      purposes: '',
      departure_time: '08:00',
      arrival_time_at_destination: '12:00',
      departure_time_from_destination: '13:00',
      arrival_time_back: '17:00',
      approximate_distance_traveled: '',
      gasoline_balance_in_tank: 0,
      gasoline_issued_by_office: 0,
      gasoline_purchased: 0,
      total: 0,
      gasoline_used: 0,
      gasoline_balance_end_trip: 0,
      gear_oil_issued_purchased: '',
      lubricating_oil_issued_purchased: '',
      grease_issued_purchased: '',
      brake_fluid_issued_purchased: '',
      speedometer_start: '',
      speedometer_end: '',
      distance_traveled: '',
      remarks: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateTripTicket.mutate(values)
      } else {
        await insertTripTicket.mutate(values)
      }
    },
  })

  const insertTripTicket = useMutation({
    mutationFn: async (values) => {
      return await api.post('trip_ticket/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()

      tripTicketProductInputRef.current.clearValue()
      tripTicketDriverInputRef.current.clearValue()
      tripTicketEquipmentInputRef.current.clearValue()
      await queryClient.invalidateQueries(['tripTicket'])
    },
    onError: (error) => {
      toast.error('Duplicate Entry!')
    },
  })
  const updateTripTicket = useMutation({
    mutationFn: async (values) => {
      return await api.put('trip_ticket/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['tripTicket'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let approximateDistanceTravel = 0
    if (name === 'gasoline_balance_in_tank') {
      // console.info(value)
      form.setFieldValue(
        'approximate_distance_traveled',
        parseFloat(value) * parseFloat(form.values.gasoline_purchased),
      )
      form.setFieldValue('total', parseFloat(value) + parseFloat(form.values.gasoline_purchased))
      form.setFieldValue('gasoline_balance_end_trip', value)
    }
    if (name === 'gasoline_purchased') {
      // console.info(value)
      form.setFieldValue('gasoline_used', value)
      form.setFieldValue(
        'approximate_distance_traveled',
        parseFloat(value) * parseFloat(form.values.gasoline_balance_in_tank),
      )
      form.setFieldValue(
        'total',
        parseFloat(value) + parseFloat(form.values.gasoline_balance_in_tank),
      )
    }
    // console.info(name)
    form.setFieldValue(name, value)
  }

  const handleSelectChange = (selectedOption, ref) => {
    // console.info(ref.name)
    if (ref.name === 'driver') {
      console.info(selectedOption.job_description)
      form.setFieldValue('purposes', selectedOption.job_description)
      // form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
    }
  }

  return (
    <>
      <ToastContainer />
      <h2>{cardTitle}</h2>
      <MaterialReactTable
        columns={column}
        data={!tripTicket.isLoading && tripTicket.data}
        state={{
          isLoading:
            tripTicket.isLoading || insertTripTicket.isPending || updateTripTicket.isPending,
          isSaving:
            tripTicket.isLoading || insertTripTicket.isPending || updateTripTicket.isPending,
          showLoadingOverlay:
            tripTicket.isLoading || insertTripTicket.isPending || updateTripTicket.isPending,
          showProgressBars:
            tripTicket.isLoading || insertTripTicket.isPending || updateTripTicket.isPending,
          showSkeletons:
            tripTicket.isLoading || insertTripTicket.isPending || updateTripTicket.isPending,
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
        enableGrouping
        columnFilterDisplayMode="popover"
        paginationDisplayMode="pages"
        positionToolbarAlertBanner="bottom"
        enableStickyHeader
        enableStickyFooter
        enableRowActions
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
            <Button
              color="primary"
              variant="outlined"
              size="medium"
              title="Add New"
              shape="rounded" // Shape should be "rounded"
              style={{ fontSize: 14 }}
              onClick={() => {
                form.resetForm()
                setIsEnableEdit(false)

                setModalVisible(!modalFormVisible)
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
            <Button
              color="primary"
              variant="outlined"
              size="medium"
              title="Export to Excel"
              shape="rounded" // Shape should be "rounded"
              style={{ fontSize: 14 }}
              onClick={() => {
                alert('Exported')
              }}
            >
              <FontAwesomeIcon icon={faFileExcel} size="xl" />
            </Button>
          </Box>
        )}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
            <Tooltip title="Edit">
              <IconButton
                color="warning"
                onClick={() => {
                  console.info(row.original)
                  form.setValues({
                    id: row.original.id,
                    control_number: row.original.control_number,
                    purchase_date: row.original.purchase_date,
                    product: row.original.product_id,
                    driver: row.original.driver_id,
                    equipment: row.original.equipment_id,
                    authorized_passengers: row.original.authorized_passengers,
                    places_to_visit: row.original.places_to_visit,
                    purposes: row.original.purposes,
                    departure_time: row.original.departure_time,
                    arrival_time_at_destination: row.original.arrival_time_at_destination,
                    departure_time_from_destination: row.original.departure_time_from_destination,
                    arrival_time_back: row.original.arrival_time_back,
                    approximate_distance_traveled: row.original.approximate_distance_traveled,
                    gasoline_balance_in_tank: row.original.gasoline_balance_in_tank,
                    gasoline_issued_by_office: row.original.gasoline_issued_by_office,
                    gasoline_purchased: row.original.gasoline_purchased,
                    total:
                      parseFloat(row.original.gasoline_balance_in_tank) +
                      parseFloat(row.original.gasoline_purchased), // total
                    gasoline_used: row.original.gasoline_used,
                    gasoline_balance_end_trip: row.original.gasoline_balance_end_trip,
                    gear_oil_issued_purchased: row.original.gear_oil_issued_purchased,
                    lubricating_oil_issued_purchased: row.original.lubricating_oil_issued_purchased,
                    grease_issued_purchased: row.original.grease_issued_purchased,
                    brake_fluid_issued_purchased: row.original.brake_fluid_issued_purchased,
                    speedometer_start: row.original.speedometer_start,
                    speedometer_end: row.original.speedometer_end,
                    distance_traveled: row.original.distance_traveled,
                    remarks: row.original.remarks,
                  })
                  setModalVisible(true)
                }}
              >
                <EditSharp />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => {
                  Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      validationPrompt(async () => {
                        let id = row.original.id

                        await api
                          .delete('trip_ticket/delete/' + id)
                          .then(async (response) => {
                            await queryClient.invalidateQueries(['tripTicket'])

                            toast.success(response.data.message)
                          })
                          .catch((error) => {
                            console.info(error.response.data)
                            // toast.error(handleError(error))
                          })
                      })
                    }
                  })
                }}
              >
                <DeleteOutline />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />

      <CModal
        alignment="center"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        backdrop="static"
        keyboard={false}
        size="xl"
        // scrollable
      >
        <CModalHeader>
          <CModalTitle>{form.values.id ? `Edit ${cardTitle}` : `Add New ${cardTitle}`}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm onSubmit={form.handleSubmit}>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              {tripTicketControlNumber.isLoading ? (
                <>
                  Please Wait <CSpinner size="sm" />
                </>
              ) : (
                <h5 className="me-md-2">
                  <h5 className="me-md-2">
                    {(() => {
                      if (form.values.id === '') {
                        const purchaseDate = form.values.purchase_date // Assuming the format is YYYY-MM-DD
                        let formattedDate = ''

                        if (purchaseDate) {
                          const [year, month, day] = purchaseDate.split('-')
                          if (year && month && day) {
                            const formattedYear = year.slice(2) // Get the last two digits of the year
                            formattedDate = `${month}-${day}-${formattedYear}`
                          }
                        }

                        const controlNumber = tripTicketControlNumber?.data?.control_number || 0
                        const formattedControlNumber = String(controlNumber).padStart(4, '0')

                        return `${
                          formattedDate ? formattedDate + '-' : ''
                        }${formattedControlNumber}`
                      } else {
                        const purchaseDate = form.values.purchase_date // Assuming the format is YYYY-MM-DD
                        let formattedDate = ''

                        if (purchaseDate) {
                          const [year, month, day] = purchaseDate.split('-')
                          if (year && month && day) {
                            const formattedYear = year.slice(2) // Get the last two digits of the year
                            formattedDate = `${month}-${day}-${formattedYear}`
                          }
                        }

                        const controlNumber = form.values.control_number || 0
                        const formattedControlNumber = String(controlNumber).padStart(4, '0')

                        return `${
                          formattedDate ? formattedDate + '-' : ''
                        }${formattedControlNumber}`
                      }
                    })()}
                  </h5>
                </h5>
              )}
            </div>

            <CRow>
              <CCol md={4}>
                <CFormText>To be filled by the Administrative Official</CFormText>
                <hr />
                <CRow>
                  <CCol md={12}>
                    <CFormInput
                      type="date"
                      label={requiredField('Date')}
                      name="purchase_date"
                      onChange={handleInputChange}
                      value={form.values.purchase_date}
                      placeholder="Date"
                      size="sm"
                    />
                    {form.touched.purchase_date && form.errors.purchase_date && (
                      <CFormText className="text-danger">{form.errors.purchase_date}</CFormText>
                    )}
                  </CCol>

                  <CCol md={12}>
                    <CFormLabel>
                      {
                        <>
                          {tripTicketProduct.isLoading && <CSpinner size="sm" />}
                          {requiredField('Product')}
                        </>
                      }
                    </CFormLabel>
                    <Select
                      ref={tripTicketProductInputRef}
                      value={
                        !tripTicketProduct.isLoading &&
                        tripTicketProduct.data?.find(
                          (option) => option.value === form.values.product,
                        )
                      }
                      onChange={handleSelectChange}
                      options={!tripTicketProduct.isLoading && tripTicketProduct.data}
                      name="product"
                      isSearchable
                      placeholder="Search..."
                      isClearable
                    />
                    {form.touched.product && form.errors.product && (
                      <CFormText className="text-danger">{form.errors.product}</CFormText>
                    )}
                  </CCol>
                  <CCol md={12}>
                    <CFormLabel>
                      {
                        <>
                          {tripTicketDriver.isLoading && <CSpinner size="sm" />}
                          {requiredField("Driver's Name")}
                        </>
                      }
                    </CFormLabel>
                    <Select
                      ref={tripTicketDriverInputRef}
                      value={
                        !tripTicketDriver.isLoading &&
                        tripTicketDriver.data?.find((option) => option.value === form.values.driver)
                      }
                      onChange={handleSelectChange}
                      options={!tripTicketDriver.isLoading && tripTicketDriver.data}
                      name="driver"
                      isSearchable
                      placeholder="Search..."
                      isClearable
                    />
                    {form.touched.driver && form.errors.driver && (
                      <CFormText className="text-danger">{form.errors.driver}</CFormText>
                    )}
                  </CCol>
                  <CCol md={12}>
                    <CFormLabel>
                      {
                        <>
                          {tripTicketEquipment.isLoading && <CSpinner size="sm" />}
                          {requiredField('Equipment')}
                        </>
                      }
                    </CFormLabel>
                    <Select
                      ref={tripTicketEquipmentInputRef}
                      value={
                        !tripTicketEquipment.isLoading &&
                        tripTicketEquipment.data?.find(
                          (option) => option.value === form.values.equipment,
                        )
                      }
                      onChange={handleSelectChange}
                      options={!tripTicketEquipment.isLoading && tripTicketEquipment.data}
                      name="equipment"
                      isSearchable
                      placeholder="Search..."
                      isClearable
                    />
                    {form.touched.equipment && form.errors.equipment && (
                      <CFormText className="text-danger">{form.errors.equipment}</CFormText>
                    )}
                  </CCol>
                  <CCol md={12}>
                    <CFormInput
                      type="text"
                      label="Name(s) of Authorized Passengers"
                      name="authorized_passengers"
                      onChange={handleInputChange}
                      value={form.values.authorized_passengers}
                      placeholder="Name(s) of Authorized Passengers"
                      size="sm"
                      invalid={
                        form.touched.authorized_passengers && form.errors.authorized_passengers
                      }
                    />
                    {form.touched.authorized_passengers && form.errors.authorized_passengers && (
                      <CFormText className="text-danger">
                        {form.errors.authorized_passengers}
                      </CFormText>
                    )}
                  </CCol>

                  <CCol md={12}>
                    <CFormInput
                      type="text"
                      label="Place(s) to be Visited/Inspected"
                      name="places_to_visit"
                      onChange={handleInputChange}
                      value={form.values.places_to_visit}
                      placeholder="Place(s) to be Visited/Inspected"
                      size="sm"
                      invalid={form.touched.places_to_visit && form.errors.places_to_visit}
                    />
                    {form.touched.places_to_visit && form.errors.places_to_visit && (
                      <CFormText className="text-danger">{form.errors.places_to_visit}</CFormText>
                    )}
                  </CCol>
                  <CCol md={12}>
                    <CFormInput
                      type="text"
                      label="Purposes"
                      name="purposes"
                      onChange={handleInputChange}
                      value={form.values.purposes}
                      placeholder="Purposes"
                      size="sm"
                    />
                  </CCol>
                </CRow>
              </CCol>

              <CCol md={8}>
                <CFormText>To be filled by the Driver</CFormText>
                <hr />

                <CRow>
                  <CCol md={6}>
                    <CRow>
                      <CCol md={12}>
                        <CFormInput
                          type="time"
                          label="1. Time of Departure"
                          name="departure_time"
                          onChange={handleInputChange}
                          value={form.values.departure_time}
                          placeholder="Time of Departure"
                          size="sm"
                        />
                      </CCol>
                      <CCol md={12}>
                        <CFormInput
                          type="time"
                          label="2. Time of Arrival"
                          name="arrival_time_at_destination"
                          onChange={handleInputChange}
                          value={form.values.arrival_time_at_destination}
                          placeholder="Time of Arrival"
                          size="sm"
                        />
                      </CCol>
                      <CCol md={12}>
                        <CFormInput
                          type="time"
                          label="3. Time of Depart"
                          name="departure_time_from_destination"
                          onChange={handleInputChange}
                          value={form.values.departure_time_from_destination}
                          placeholder="Time of Depart"
                          size="sm"
                        />
                      </CCol>
                      <CCol md={12}>
                        <CFormInput
                          type="time"
                          label="4. Time of Arrival Back"
                          name="arrival_time_back"
                          onChange={handleInputChange}
                          value={form.values.arrival_time_back}
                          placeholder="Time of Depart"
                          size="sm"
                        />
                      </CCol>
                      <CCol md={12}>
                        <CFormInput
                          type="number"
                          label="5. Approximate Distance Travel (km)"
                          name="approximate_distance_traveled"
                          onChange={handleInputChange}
                          value={form.values.approximate_distance_traveled}
                          placeholder="0"
                          style={{ textAlign: 'right', backgroundColor: '#D8EFD3' }}
                          size="sm"
                        />
                      </CCol>
                    </CRow>

                    <CRow>
                      <CFormLabel>6. Gas Issued, Purchase & Consumed (L)</CFormLabel>

                      <CFormLabel htmlFor="inputEmail3" className="col-md-8 col-form-label">
                        a. Balance in Tank
                      </CFormLabel>
                      <CCol md={4}>
                        <CFormInput
                          type="number"
                          name="gasoline_balance_in_tank"
                          onChange={handleInputChange}
                          style={{ textAlign: 'right' }}
                          value={form.values.gasoline_balance_in_tank}
                          placeholder="0"
                          size="sm"
                        />
                      </CCol>
                      <CFormLabel className="col-md-8 col-form-label ml-4" size="sm">
                        b. Issued By Office
                      </CFormLabel>
                      <CCol md={4}>
                        <CFormInput
                          type="number"
                          name="gasoline_issued_by_office"
                          onChange={handleInputChange}
                          style={{ textAlign: 'right' }}
                          value={form.values.gasoline_issued_by_office}
                          placeholder="0"
                          size="sm"
                        />
                      </CCol>
                      <CFormLabel className="col-md-8 col-form-label" size="sm">
                        c. Add Purchase
                      </CFormLabel>
                      <CCol md={4}>
                        <CFormInput
                          type="number"
                          name="gasoline_purchased"
                          onChange={handleInputChange}
                          style={{ textAlign: 'right' }}
                          value={form.values.gasoline_purchased}
                          placeholder="0"
                          size="sm"
                        />
                      </CCol>
                      <CFormLabel className="col-md-8 col-form-label" size="sm">
                        <strong>TOTAL</strong>
                      </CFormLabel>
                      <CCol md={4}>
                        <CFormInput
                          type="number"
                          placeholder="0"
                          name="total"
                          value={form.values.total}
                          style={{ textAlign: 'right', backgroundColor: '#D8EFD3' }}
                          size="sm"
                          readOnly={true}
                        />
                      </CCol>
                      <CFormLabel className="col-md-8 col-form-label" size="sm">
                        d. Deduct
                      </CFormLabel>
                      <CCol md={4}>
                        <CFormInput
                          type="number"
                          name="gasoline_used"
                          onChange={handleInputChange}
                          style={{ textAlign: 'right', backgroundColor: '#D8EFD3' }}
                          value={form.values.gasoline_used}
                          placeholder="0"
                          size="sm"
                          readOnly={true}
                        />
                      </CCol>
                      <CFormLabel className="col-md-8 col-form-label" size="sm">
                        e. Balance
                      </CFormLabel>
                      <CCol md={4}>
                        <CFormInput
                          type="number"
                          name="gasoline_balance_end_trip"
                          onChange={handleInputChange}
                          style={{ textAlign: 'right', backgroundColor: '#D8EFD3' }}
                          value={form.values.gasoline_balance_end_trip}
                          placeholder="0"
                          size="sm"
                          readOnly={true}
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow>
                      <CFormLabel className="col-md-8 col-form-label" size="sm">
                        7. Gear Oil
                      </CFormLabel>
                      <CCol md={4}>
                        <CFormInput
                          type="number"
                          name="gear_oil_issued_purchased"
                          onChange={handleInputChange}
                          style={{ textAlign: 'right' }}
                          value={form.values.gear_oil_issued_purchased}
                          placeholder="0"
                          size="sm"
                        />
                      </CCol>
                      <CFormLabel className="col-md-8 col-form-label" size="sm">
                        8. Lubricating Oil
                      </CFormLabel>
                      <CCol md={4}>
                        <CFormInput
                          type="number"
                          name="lubricating_oil_issued_purchased"
                          onChange={handleInputChange}
                          style={{ textAlign: 'right' }}
                          value={form.values.lubricating_oil_issued_purchased}
                          placeholder="0"
                          size="sm"
                        />
                      </CCol>
                      <CFormLabel className="col-md-8 col-form-label" size="sm">
                        9. Greased
                      </CFormLabel>
                      <CCol md={4}>
                        <CFormInput
                          type="number"
                          name="grease_issued_purchased"
                          onChange={handleInputChange}
                          style={{ textAlign: 'right' }}
                          value={form.values.grease_issued_purchased}
                          placeholder="0"
                          size="sm"
                        />
                      </CCol>
                      <CFormLabel className="col-md-8 col-form-label" size="sm">
                        10. Brake Fluid
                      </CFormLabel>
                      <CCol md={4}>
                        <CFormInput
                          type="number"
                          name="brake_fluid_issued_purchased"
                          onChange={handleInputChange}
                          style={{ textAlign: 'right' }}
                          value={form.values.brake_fluid_issued_purchased}
                          placeholder="0"
                          size="sm"
                        />
                      </CCol>

                      <CFormLabel>11. Speedometer Readings, if any</CFormLabel>

                      <CFormLabel className="col-md-8 col-form-label" size="sm">
                        Beginning Trip
                      </CFormLabel>
                      <CCol md={4}>
                        <CFormInput
                          type="number"
                          name="speedometer_start"
                          onChange={handleInputChange}
                          style={{ textAlign: 'right' }}
                          value={form.values.speedometer_start}
                          placeholder="0"
                          size="sm"
                        />
                      </CCol>

                      <CFormLabel className="col-md-8 col-form-label" size="sm">
                        End Trip
                      </CFormLabel>
                      <CCol md={4}>
                        <CFormInput
                          type="number"
                          name="speedometer_end"
                          onChange={handleInputChange}
                          style={{ textAlign: 'right' }}
                          value={form.values.speedometer_end}
                          placeholder="0"
                          size="sm"
                        />
                      </CCol>
                      <CFormLabel className="col-md-8 col-form-label" size="sm">
                        Distance Traveled
                      </CFormLabel>
                      <CCol md={4}>
                        <CFormInput
                          type="number"
                          name="distance_traveled"
                          onChange={handleInputChange}
                          style={{ textAlign: 'right' }}
                          value={form.values.distance_traveled}
                          placeholder="0"
                          size="sm"
                        />
                      </CCol>
                      <CCol md={12}>
                        <CFormLabel className="col-md-8 col-form-label" size="sm">
                          Remarks
                        </CFormLabel>
                        <CFormTextarea
                          placeholder="Remarks"
                          name="remarks"
                          onChange={handleInputChange}
                          style={{ height: '100px' }}
                        >
                          {form.values.remarks}
                        </CFormTextarea>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  {form.values.id === '' ? 'Submit' : 'Update'}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
          {(insertTripTicket.isPending || updateTripTicket.isPending) && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default TripTicket
