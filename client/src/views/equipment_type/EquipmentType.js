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
  const [modalVisible, setModalVisible] = useState(false)
  const selectRoleTypeInputRef = useRef()
  const [operationLoading, setOperationLoading] = useState(false)
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const [modalChangePasswordFormVisible, setModalChangePasswordFormVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [togglePassword, setTogglePassword] = useState(true)
  const column = [
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

  const equipmentType = useQuery({
    queryFn: async () =>
      await api.get('equipment_type').then((response) => {
        return response.data
      }),
    queryKey: ['equipmentType'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    type: Yup.string().required('Type is required'),
    times: Yup.string().required('Times is required'),
    tank_balance: Yup.string().required('balance in Tank is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      type: '',
      times: '',
      tank_balance: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateEquipmentType.mutate(values)
      } else {
        await insertEquipmentType.mutate(values)
      }
    },
  })

  const insertEquipmentType = useMutation({
    mutationFn: async (values) => {
      return await api.post('equipment_type/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      setModalVisible(false)
      form.resetForm()
      await queryClient.invalidateQueries(['equipmentType'])
    },
    onError: (error) => {
      toast.error('Duplicate Entry!')
    },
  })
  const updateEquipmentType = useMutation({
    mutationFn: async (values) => {
      return await api.put('equipment_type/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['equipmentType'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    form.setFieldValue(name, value)
  }

  return (
    <>
      <ToastContainer />
      <h2>{cardTitle}</h2>
      <MaterialReactTable
        columns={column}
        data={!equipmentType.isLoading && equipmentType.data}
        state={{
          isLoading:
            equipmentType.isLoading ||
            insertEquipmentType.isPending ||
            updateEquipmentType.isPending,
          isSaving:
            equipmentType.isLoading ||
            insertEquipmentType.isPending ||
            updateEquipmentType.isPending,
          showLoadingOverlay:
            equipmentType.isLoading ||
            insertEquipmentType.isPending ||
            updateEquipmentType.isPending,
          showProgressBars:
            equipmentType.isLoading ||
            insertEquipmentType.isPending ||
            updateEquipmentType.isPending,
          showSkeletons:
            equipmentType.isLoading ||
            insertEquipmentType.isPending ||
            updateEquipmentType.isPending,
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
                  console.info(row.original)
                  form.setValues({
                    id: row.original.id,
                    type: row.original.type,
                    times: row.original.times,
                    tank_balance: row.original.tank_balance,
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
                          .delete('equipment_type/delete/' + id)
                          .then(async (response) => {
                            await queryClient.invalidateQueries(['equipmentType'])

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
                  label={requiredField('Type')}
                  name="type"
                  onChange={handleInputChange}
                  value={form.values.type}
                  placeholder="Type"
                  invalid={form.touched.type && form.errors.type}
                />

                {form.touched.type && form.errors.type && (
                  <CFormText className="text-danger">{form.errors.type}</CFormText>
                )}
              </CCol>

              <CCol md={12}>
                <CFormInput
                  type="number"
                  label={requiredField('Times')}
                  name="times"
                  onChange={handleInputChange}
                  value={form.values.times}
                  placeholder="Times"
                  invalid={form.touched.times && form.errors.times}
                />
                {form.touched.times && form.errors.times && (
                  <CFormText className="text-danger">{form.errors.times}</CFormText>
                )}
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="number"
                  label={requiredField('Balance in Tank')}
                  name="tank_balance"
                  onChange={handleInputChange}
                  value={form.values.tank_balance}
                  placeholder="Balance in Tank"
                  invalid={form.touched.tank_balance && form.errors.tank_balance}
                />
                {form.touched.tank_balance && form.errors.tank_balance && (
                  <CFormText className="text-danger">{form.errors.tank_balance}</CFormText>
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
          {(insertEquipmentType.isPending || updateEquipmentType.isPending) && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default Driver
