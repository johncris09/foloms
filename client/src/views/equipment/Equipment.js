import React, { useState, useRef } from 'react'
import Swal from 'sweetalert2'
import 'cropperjs/dist/cropper.css'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormText,
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
import { faEye, faEyeSlash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { DeleteOutline, EditSharp, Key } from '@mui/icons-material'
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

const Driver = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const equipmentOfficeInputRef = useRef()
  const equipmentTypeInputRef = useRef()
  const [modalVisible, setModalVisible] = useState(false)
  const selectRoleTypeInputRef = useRef()
  const [operationLoading, setOperationLoading] = useState(false)
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const [modalChangePasswordFormVisible, setModalChangePasswordFormVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [togglePassword, setTogglePassword] = useState(true)
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
      accessorKey: 'fuel_capacity',
      header: ' Fuel Capacity (L)',
    },
    {
      accessorKey: 'abbr',
      header: 'Office',
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'times',
      header: 'Times',
    },
    {
      accessorKey: 'tank_balance',
      header: 'Balance in Tank',
    },
  ]

  const equipment = useQuery({
    queryFn: async () =>
      await api.get('equipment').then((response) => {
        return response.data
      }),
    queryKey: ['equipment'],
    staleTime: Infinity,
  })

  const equipmentOffice = useQuery({
    queryFn: async () =>
      await api.get('office').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.abbr} - ${item.office}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['equipmentOffice'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const equipmentType = useQuery({
    queryFn: async () =>
      await api.get('equipment_type').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.type} - ${item.times}* - ${item.tank_balance}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['equipment_type'],
    staleTime: Infinity,
    // refetchInterval: 1000,
  })

  const validationSchema = Yup.object().shape({
    office: Yup.string().required('office is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      model: '',
      plate_number: '',
      fuel_capacity: '',
      office: '',
      equipment_type: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateEquipment.mutate(values)
      } else {
        await insertEquipment.mutate(values)
      }
    },
  })

  const insertEquipment = useMutation({
    mutationFn: async (values) => {
      return await api.post('equipment/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      setModalVisible(false)
      form.resetForm()
      equipmentOfficeInputRef.current.clearValue()
      await queryClient.invalidateQueries(['equipment'])
    },
    onError: (error) => {
      toast.error('Duplicate Entry!')
    },
  })
  const updateEquipment = useMutation({
    mutationFn: async (values) => {
      return await api.put('equipment/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['equipment'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const handleInputChange = (e) => {
    form.handleChange(e)
    const { name, value } = e.target
    form.setFieldValue(name, value)
  }

  const handleSelectChange = (selectedOption, ref) => {
    form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }
  return (
    <>
      <ToastContainer />
      <h2>{cardTitle}</h2>
      <MaterialReactTable
        columns={column}
        data={!equipment.isLoading && equipment.data}
        state={{
          isLoading: equipment.isLoading || insertEquipment.isPending || updateEquipment.isPending,
          isSaving: equipment.isLoading || insertEquipment.isPending || updateEquipment.isPending,
          showLoadingOverlay:
            equipment.isLoading || insertEquipment.isPending || updateEquipment.isPending,
          showProgressBars:
            equipment.isLoading || insertEquipment.isPending || updateEquipment.isPending,
          showSkeletons:
            equipment.isLoading || insertEquipment.isPending || updateEquipment.isPending,
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
              shape="rounded"
              style={{ fontSize: 20 }}
              onClick={() => {
                form.resetForm()
                setIsEnableEdit(false)

                setModalVisible(!modalFormVisible)
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Box>
        )}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
            <Tooltip title="Edit">
              <IconButton
                color="warning"
                onClick={() => {
                  form.setValues({
                    id: row.original.id,
                    plate_number: row.original.plate_number,
                    model: row.original.model,
                    office: row.original.office_id,
                    fuel_capacity: row.original.fuel_capacity,
                    equipment_type: row.original.equipment_type,
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
                          .delete('equipment/delete/' + id)
                          .then(async (response) => {
                            await queryClient.invalidateQueries(['equipment'])

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
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>{form.values.id ? `Edit ${cardTitle}` : `Add New ${cardTitle}`}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm className="row g-3   mt-4" onSubmit={form.handleSubmit}>
            <CRow>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Model"
                  name="model"
                  onChange={handleInputChange}
                  value={form.values.model}
                  placeholder="Model"
                />
              </CCol>

              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Plate #"
                  name="plate_number"
                  onChange={handleInputChange}
                  value={form.values.plate_number}
                  placeholder="Plate #"
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="number"
                  label="Fuel Capacity"
                  name="fuel_capacity"
                  onChange={handleInputChange}
                  value={form.values.fuel_capacity}
                  placeholder="Fuel Capacity"
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel>
                  {
                    <>
                      {equipmentOffice.isLoading && <CSpinner size="sm" />}
                      {requiredField('Office')}
                    </>
                  }
                </CFormLabel>
                <Select
                  ref={equipmentOfficeInputRef}
                  value={
                    !equipmentOffice.isLoading &&
                    equipmentOffice.data?.find((option) => option.value === form.values.office)
                  }
                  onChange={handleSelectChange}
                  options={!equipmentOffice.isLoading && equipmentOffice.data}
                  name="office"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
                {form.touched.office && form.errors.office && (
                  <CFormText className="text-danger">{form.errors.office}</CFormText>
                )}
              </CCol>
              <CCol md={12}>
                <CFormLabel>
                  {
                    <>
                      {equipmentType.isLoading && <CSpinner size="sm" />}
                      {requiredField('Equipment Type')}
                    </>
                  }
                </CFormLabel>
                <Select
                  ref={equipmentTypeInputRef}
                  value={
                    !equipmentType.isLoading &&
                    equipmentType.data?.find(
                      (option) => option.value === form.values.equipment_type,
                    )
                  }
                  onChange={handleSelectChange}
                  options={!equipmentType.isLoading && equipmentType.data}
                  name="equipment_type"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
                {form.touched.equipment_type && form.errors.equipment_type && (
                  <CFormText className="text-danger">{form.errors.equipment_type}</CFormText>
                )}
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  {form.values.id ? 'Update' : 'Submit'}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
          {(insertEquipment.isPending || updateEquipment.isPending) && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default Driver
