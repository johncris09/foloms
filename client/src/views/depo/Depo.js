import React, { useState } from 'react'
import Swal from 'sweetalert2'
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
import { MaterialReactTable } from 'material-react-table'
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

const Depo = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)

  const column = [
    {
      accessorKey: 'name',
      header: 'Depo Name',
    },
    {
      accessorKey: 'location',
      header: 'Location',
      accessorFn: (row) => row.location || '-',
    },
  ]

  const depos = useQuery({
    queryFn: async () =>
      await api.get('depo').then((response) => {
        return response.data
      }),
    queryKey: ['depo'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Depo Name is required'),
    location: Yup.string(),
  })

  const form = useFormik({
    initialValues: {
      id: '',
      name: '',
      location: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateDepo.mutate(values)
      } else {
        await insertDepo.mutate(values)
      }
    },
  })

  const insertDepo = useMutation({
    mutationFn: async (values) => {
      return await api.post('depo/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries(['depo'])
    },
    onError: () => {
      toast.error('Duplicate Entry!')
    },
  })

  const updateDepo = useMutation({
    mutationFn: async (values) => {
      return await api.put('depo/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['depo'])
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update')
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    form.setFieldValue(name, value)
  }

  return (
    <>
      <ToastContainer />
      <PageTitle pageTitle={cardTitle} />
      <MaterialReactTable
        columns={column}
        data={!depos.isLoading && depos.data}
        state={{
          isLoading: depos.isLoading || insertDepo.isPending || updateDepo.isPending,
          isSaving: depos.isLoading || insertDepo.isPending || updateDepo.isPending,
          showLoadingOverlay: depos.isLoading || insertDepo.isPending || updateDepo.isPending,
          showProgressBars: depos.isLoading || insertDepo.isPending || updateDepo.isPending,
          showSkeletons: depos.isLoading || insertDepo.isPending || updateDepo.isPending,
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
        renderTopToolbarCustomActions={() => (
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
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
            <Tooltip title="Edit">
              <IconButton
                color="warning"
                onClick={() => {
                  form.setValues({
                    id: row.original.id,
                    name: row.original.name,
                    location: row.original.location || '',
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
                        const id = row.original.id

                        await api
                          .delete('depo/delete/' + id)
                          .then(async (response) => {
                            await queryClient.invalidateQueries(['depo'])
                            toast.success(response.data.message)
                          })
                          .catch((error) => {
                            toast.error(error?.response?.data?.message || 'Failed to delete')
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
          <CForm className="row g-3 mt-4" onSubmit={form.handleSubmit}>
            <CRow>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label={requiredField('Depo Name')}
                  name="name"
                  onChange={handleInputChange}
                  value={form.values.name}
                  placeholder="Depo Name"
                />
                {form.touched.name && form.errors.name && (
                  <CFormText className="text-danger">{form.errors.name}</CFormText>
                )}
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Location (optional)"
                  name="location"
                  onChange={handleInputChange}
                  value={form.values.location}
                  placeholder="Location"
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
          {(insertDepo.isPending || updateDepo.isPending) && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default Depo
