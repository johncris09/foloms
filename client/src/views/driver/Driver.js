import React, { useState } from 'react'
import Swal from 'sweetalert2'
import 'cropperjs/dist/cropper.css'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormText,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
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

const Driver = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const column = [
    {
      accessorKey: 'last_name',
      header: 'Last Name',
    },
    {
      accessorKey: 'first_name',
      header: 'First Name',
    },
    {
      accessorKey: 'middle_name',
      header: 'Middle Name',
    },
    {
      accessorKey: 'suffix',
      header: 'Suffix',
    },
    {
      accessorKey: 'contact_number',
      header: 'Contact #',
    },
    {
      accessorKey: 'job_description',
      header: 'Job Description',
    },
  ]

  const driver = useQuery({
    queryFn: async () =>
      await api.get('driver').then((response) => {
        return response.data
      }),
    queryKey: ['driver'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      suffix: '',
      contact_number: '',
      job_description: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateDriver.mutate(values)
      } else {
        await insertDriver.mutate(values)
      }
    },
  })

  const insertDriver = useMutation({
    mutationFn: async (values) => {
      return await api.post('driver/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries(['driver'])
    },
    onError: (error) => {
      toast.error('Duplicate Entry!')
    },
  })
  const updateDriver = useMutation({
    mutationFn: async (values) => {
      return await api.put('driver/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['driver'])
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

  return (
    <>
      <ToastContainer />
      <PageTitle pageTitle={cardTitle} />
      <MaterialReactTable
        columns={column}
        data={!driver.isLoading && driver.data}
        state={{
          isLoading: driver.isLoading || insertDriver.isPending || updateDriver.isPending,
          isSaving: driver.isLoading || insertDriver.isPending || updateDriver.isPending,
          showLoadingOverlay: driver.isLoading || insertDriver.isPending || updateDriver.isPending,
          showProgressBars: driver.isLoading || insertDriver.isPending || updateDriver.isPending,
          showSkeletons: driver.isLoading || insertDriver.isPending || updateDriver.isPending,
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

                setModalVisible(!modalVisible)
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
                    last_name: row.original.last_name,
                    first_name: row.original.first_name,
                    middle_name: row.original.middle_name,
                    suffix: row.original.suffix,
                    contact_number: row.original.contact_number,
                    job_description: row.original.job_description,
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
                          .delete('driver/delete/' + id)
                          .then(async (response) => {
                            await queryClient.invalidateQueries(['driver'])

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
                  label={requiredField('First Name')}
                  name="first_name"
                  onChange={handleInputChange}
                  value={form.values.first_name}
                  placeholder="First Name"
                  invalid={form.touched.first_name && form.errors.first_name}
                />
                {form.touched.first_name && form.errors.first_name && (
                  <CFormText className="text-danger">{form.errors.first_name}</CFormText>
                )}
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Middle Name"
                  name="middle_name"
                  onChange={handleInputChange}
                  value={form.values.middle_name}
                  placeholder="Middle Name"
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label={requiredField('Last Name')}
                  name="last_name"
                  onChange={handleInputChange}
                  value={form.values.last_name}
                  placeholder="Last Name"
                  invalid={form.touched.last_name && form.errors.last_name}
                />
                {form.touched.last_name && form.errors.last_name && (
                  <CFormText className="text-danger">{form.errors.last_name}</CFormText>
                )}
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Suffix"
                  name="suffix"
                  onChange={handleInputChange}
                  value={form.values.suffix}
                  placeholder="Suffix"
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Contact #"
                  name="contact_number"
                  onChange={handleInputChange}
                  value={form.values.contact_number}
                  placeholder="Contact #"
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Job Description"
                  name="job_description"
                  onChange={handleInputChange}
                  value={form.values.job_description}
                  placeholder="Job Description"
                />
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
          {(insertDriver.isPending || updateDriver.isPending) && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default Driver
