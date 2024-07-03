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

const Office = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const selectRoleTypeInputRef = useRef()
  const [operationLoading, setOperationLoading] = useState(false)
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const [modalChangePasswordFormVisible, setModalChangePasswordFormVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [togglePassword, setTogglePassword] = useState(true)
  const column = [
    {
      accessorKey: 'abbr',
      header: 'Abbr',
    },
    {
      accessorKey: 'office',
      header: 'Office',
    },
  ]

  const office = useQuery({
    queryFn: async () =>
      await api.get('office').then((response) => {
        return response.data
      }),
    queryKey: ['office'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    abbr: Yup.string().required('Abbreviation is required'),
    office: Yup.string().required('Office Name is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      abbr: '',
      office: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateOffice.mutate(values)
      } else {
        await insertOffice.mutate(values)
      }
    },
  })

  const insertOffice = useMutation({
    mutationFn: async (values) => {
      return await api.post('office/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      // tripTicketProductInputRef.current.clearValue()
      await queryClient.invalidateQueries(['office'])
    },
    onError: (error) => {
      toast.error('Duplicate Entry!')
    },
  })
  const updateOffice = useMutation({
    mutationFn: async (values) => {
      return await api.put('office/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['office'])
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
        data={!office.isLoading && office.data}
        state={{
          isLoading: office.isLoading || insertOffice.isPending || updateOffice.isPending,
          isSaving: office.isLoading || insertOffice.isPending || updateOffice.isPending,
          showLoadingOverlay: office.isLoading || insertOffice.isPending || updateOffice.isPending,
          showProgressBars: office.isLoading || insertOffice.isPending || updateOffice.isPending,
          showSkeletons: office.isLoading || insertOffice.isPending || updateOffice.isPending,
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
                  form.setValues({
                    id: row.original.id,
                    abbr: row.original.abbr,
                    office: row.original.office,
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
                          .delete('office/delete/' + id)
                          .then(async (response) => {
                            await queryClient.invalidateQueries(['office'])

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
        size="md"
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
                  label={requiredField('Abbreviation')}
                  name="abbr"
                  onChange={handleInputChange}
                  value={form.values.abbr}
                  placeholder="Abbreviation"
                  invalid={form.touched.abbr && form.errors.abbr}
                />
                {form.touched.abbr && form.errors.abbr && (
                  <CFormText className="text-danger">{form.errors.abbr}</CFormText>
                )}
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label={requiredField('Office')}
                  name="office"
                  onChange={handleInputChange}
                  value={form.values.office}
                  placeholder="Office"
                  invalid={form.touched.office && form.errors.office}
                />
                {form.touched.office && form.errors.office && (
                  <CFormText className="text-danger">{form.errors.office}</CFormText>
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
          {(insertOffice.isPending || updateOffice.isPending) && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default Office
