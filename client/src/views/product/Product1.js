import React, { useState, useRef, useEffect } from 'react'
import { DataTable } from 'mantine-datatable'
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
import companies from './companies.json'

const PAGE_SIZE = 2
const PAGE_SIZES = [5, 10, 15, 20]

const Product = ({ cardTitle }) => {
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])

  useEffect(() => {
    setPage(1)
  }, [pageSize])
  const [page, setPage] = useState(1)
  const [records, setRecords] = useState(companies.slice(0, PAGE_SIZE))
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const column = [
    {
      accessorKey: 'product',
      header: 'Product',
    },
  ]

  const product = useQuery({
    queryFn: async () =>
      await api.get('product').then((response) => {
        return response.data
      }),
    queryKey: ['product'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    product: Yup.string().required('Product is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      product: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateProduct.mutate(values)
      } else {
        await insertProduct.mutate(values)
      }
    },
  })

  const insertProduct = useMutation({
    mutationFn: async (values) => {
      return await api.post('product/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries(['product'])
    },
    onError: (error) => {
      toast.error('Duplicate Entry!')
    },
  })
  const updateProduct = useMutation({
    mutationFn: async (values) => {
      return await api.put('product/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['product'])
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

  useEffect(() => {
    const from = (page - 1) * pageSize
    const to = from + pageSize
    setRecords(companies.slice(from, to))
  }, [page, pageSize])
  return (
    <>
      <ToastContainer />
      <DataTable
        height={300}
        scrollAreaProps={{ type: 'scroll' }}
        // withTableBorder
        borderRadius="sm"
        // noRecordsText="No records to show"
        shadow="xs"
        // withColumnBorders
        striped
        highlightOnHover
        // horizontalSpacing="xs"
        // verticalSpacing="md"
        fz="sm"
        verticalAlign="center"
        totalRecords={companies.length}
        paginationActiveBackgroundColor="grape"
        recordsPerPage={pageSize}
        page={page}
        onPageChange={(p) => setPage(p)}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={setPageSize}
        columns={[
          {
            accessor: 'index',
            title: '#',
            textAlign: 'right',
            width: 40,
            render: (record) => companies.indexOf(record) + 1,
          },
          { accessor: 'name', sortable: true }, // render: ({ firstName, lastName }) => `${firstName} ${lastName}`
          {
            accessor: 'missionStatement',
            // visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.xs})`,
          },
          {
            accessor: 'streetAddress',
          },
          { accessor: 'city' },
          { accessor: 'state' },
        ]}
        records={records}
      />
    </>
  )
}

export default Product
