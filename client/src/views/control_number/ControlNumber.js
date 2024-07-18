import React, { useState } from 'react'
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
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, IconButton, Tooltip } from '@mui/material'
import { EditSharp } from '@mui/icons-material'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  requiredField,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PageTitle from 'src/components/PageTitle'

const Driver = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const column = [
    {
      accessorKey: 'control_number',
      header: 'Control Number',
    },
  ]

  const controlNumber = useQuery({
    queryFn: async () =>
      await api.get('control_number').then((response) => {
        return response.data
      }),
    queryKey: ['controlNumber'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    control_number: Yup.string().required('Control Number is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      control_number: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateControlNumber.mutate(values)
      }
    },
  })

  const updateControlNumber = useMutation({
    mutationFn: async (values) => {
      return await api.put('control_number/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['controlNumber'])
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
        data={!controlNumber.isLoading && controlNumber.data}
        state={{
          isLoading: controlNumber.isLoading || updateControlNumber.isPending,
          isSaving: controlNumber.isLoading || updateControlNumber.isPending,
          showLoadingOverlay: controlNumber.isLoading || updateControlNumber.isPending,
          showProgressBars: controlNumber.isLoading || updateControlNumber.isPending,
          showSkeletons: controlNumber.isLoading || updateControlNumber.isPending,
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
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
            <Tooltip title="Edit">
              <IconButton
                color="warning"
                onClick={() => {
                  form.setValues({
                    id: row.original.id,
                    control_number: row.original.control_number,
                  })
                  setModalVisible(true)
                }}
              >
                <EditSharp />
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
                  label={requiredField('Control Number')}
                  name="control_number"
                  onChange={handleInputChange}
                  value={form.values.control_number}
                  placeholder="Control Number"
                  invalid={form.touched.control_number && form.errors.control_number}
                />
                {form.touched.control_number && form.errors.control_number && (
                  <CFormText className="text-danger">{form.errors.control_number}</CFormText>
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
          {updateControlNumber.isPending && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default Driver
