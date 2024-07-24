import React, { useState, useRef } from 'react'

import Select from 'react-select'
import Swal from 'sweetalert2'
import 'cropperjs/dist/cropper.css'
import {
  CButton,
  CCol,
  CForm,
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

const Office = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const productDeliveryInputRef = useRef()
  const supplierDeliveryInputRef = useRef()
  const [modalVisible, setModalVisible] = useState(false)
  const column = [
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'product',
      header: 'Product',
    },
    {
      accessorKey: 'liters',
      header: 'Liters',
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
    },
  ]

  const delivery = useQuery({
    queryFn: async () =>
      await api.get('delivery').then((response) => {
        return response.data
      }),
    queryKey: ['delivery'],
    staleTime: Infinity,
  })

  const productDelivery = useQuery({
    queryFn: async () =>
      await api.get('product').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.product}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['productDelivery'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const supplierDelivery = useQuery({
    queryFn: async () =>
      await api.get('supplier').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.supplier}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['supplierDelivery'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })
  const validationSchema = Yup.object().shape({
    date: Yup.string().required('Date is required'),
    liters: Yup.string().required('Liters is required'),
    supplier: Yup.string().required('Supplier is required'),
    product: Yup.string().required('Product is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      date: '',
      liters: '',
      supplier: '',
      product: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateDelivery.mutate(values)
      } else {
        await insertDelivery.mutate(values)
      }
    },
  })

  const insertDelivery = useMutation({
    mutationFn: async (values) => {
      return await api.post('delivery/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      // tripTicketProductInputRef.current.clearValue()
      await queryClient.invalidateQueries(['delivery'])
    },
    onError: (error) => {
      toast.error('Duplicate Entry!')
    },
  })
  const updateDelivery = useMutation({
    mutationFn: async (values) => {
      return await api.put('delivery/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['delivery'])
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

  const handleSelectChange = (selectedOption, ref) => {
    form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }
  return (
    <>
      <ToastContainer />
      <PageTitle pageTitle={cardTitle} />
      <MaterialReactTable
        columns={column}
        data={!delivery.isLoading && delivery.data}
        state={{
          isLoading: delivery.isLoading || insertDelivery.isPending || updateDelivery.isPending,
          isSaving: delivery.isLoading || insertDelivery.isPending || updateDelivery.isPending,
          showLoadingOverlay:
            delivery.isLoading || insertDelivery.isPending || updateDelivery.isPending,
          showProgressBars:
            delivery.isLoading || insertDelivery.isPending || updateDelivery.isPending,
          showSkeletons: delivery.isLoading || insertDelivery.isPending || updateDelivery.isPending,
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
                    date: row.original.date,
                    liters: row.original.liters,
                    supplier: row.original.supplier_id,
                    product: row.original.product_id,
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
                          .delete('delivery/delete/' + id)
                          .then(async (response) => {
                            await queryClient.invalidateQueries(['delivery'])

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
                  type="date"
                  label={requiredField('Date')}
                  name="date"
                  onChange={handleInputChange}
                  value={form.values.date}
                  placeholder="Date"
                  invalid={form.touched.date && form.errors.date}
                />
                {form.touched.date && form.errors.date && (
                  <CFormText className="text-danger">{form.errors.date}</CFormText>
                )}
              </CCol>

              <CCol md={12}>
                <CFormInput
                  type="number"
                  label={requiredField('Liters')}
                  name="liters"
                  onChange={handleInputChange}
                  value={form.values.liters}
                  placeholder="Liters"
                  invalid={form.touched.liters && form.errors.liters}
                />
                {form.touched.liters && form.errors.liters && (
                  <CFormText className="text-danger">{form.errors.liters}</CFormText>
                )}
              </CCol>
              <CCol md={12}>
                <CFormLabel>
                  {
                    <>
                      {productDelivery.isLoading && <CSpinner size="sm" />}
                      {requiredField('Product')}
                    </>
                  }
                </CFormLabel>
                <Select
                  ref={productDeliveryInputRef}
                  value={
                    !productDelivery.isLoading &&
                    productDelivery.data?.find((option) => option.value === form.values.product)
                  }
                  onChange={handleSelectChange}
                  options={!productDelivery.isLoading && productDelivery.data}
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
                      {supplierDelivery.isLoading && <CSpinner size="sm" />}
                      {requiredField('Supplier')}
                    </>
                  }
                </CFormLabel>
                <Select
                  ref={supplierDeliveryInputRef}
                  value={
                    !supplierDelivery.isLoading &&
                    supplierDelivery.data?.find((option) => option.value === form.values.supplier)
                  }
                  onChange={handleSelectChange}
                  options={!supplierDelivery.isLoading && supplierDelivery.data}
                  name="supplier"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
                {form.touched.supplier && form.errors.supplier && (
                  <CFormText className="text-danger">{form.errors.supplier}</CFormText>
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
          {(insertDelivery.isPending || updateDelivery.isPending) && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default Office
