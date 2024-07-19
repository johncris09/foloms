import React, { useState, useEffect, useCallback } from 'react'
import { utils, writeFile } from 'xlsx'
import { ToastContainer, toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { api } from 'src/components/SystemConfiguration'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CCard, CCardBody } from '@coreui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { StyleSheet, Font } from '@react-pdf/renderer'
import MonthlyReport from './MonthlyReport'
import DailyFuelConsumptionReport from './DailyFuelConsumptionReport'
import PageTitle from 'src/components/PageTitle'

const Report = ({ cardTitle }) => {
  const [activeKey, setActiveKey] = useState(4)
  const [chunks, setChunks] = useState([])
  const [totalChunks, setTotalChunks] = useState(2)
  const queryClient = useQueryClient()
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const validationSchema = Yup.object().shape({
    purchase_date: Yup.string().required('Date is required'),
  })
  const filter = useFormik({
    initialValues: {
      purchase_date: '2024-06-17T16:00:00.000Z',
    },
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      await filterSummaryConsumption.mutate(values)
      // await api.get('summary_consumption/filter', { params: values }).then((response) => {
      //   console.info(response.data)
      // })
    },
  })

  const [pres, setPres] = useState([])

  const exportFile = useCallback(() => {
    /* generate worksheet from state */
    const ws = utils.json_to_sheet(pres)
    /* create workbook and append worksheet */
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Summary Consumption')
    /* export to XLSX */
    writeFile(wb, 'Summary_Consumption.xlsx')
  }, [pres])

  const filterSummaryConsumption = useMutation({
    mutationKey: ['filterSummaryConsumption'],
    mutationFn: async (values) => {
      return await api.get('summary_consumption/filter', { params: values })
    },
    onSuccess: async (response) => {
      const data = response.data.summary_consumption
      const dividedArray = chunkArray(data, parseInt(rowsPerPage))
      setChunks(dividedArray)
      console.info(dividedArray)
      setTotalChunks(parseInt(dividedArray.length))

      // setPrintPreviewModalVisible(true)
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const handleInputChange = (date) => {
    filter.setFieldValue('purchase_date', date)
  }

  const chunkArray = (arr, size) => {
    const slice = []
    for (let i = 0; i < arr.length; i += size) {
      slice.push(arr.slice(i, i + size))
    }

    return slice
  }

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: 10,
      height: '100%',
    },
    header: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    country: {
      fontSize: '16pt',
    },
    office: {
      fontSize: '14pt',
    },
    city: {
      fontSize: '12pt',
    },
    citytag: {
      fontSize: '9pt',
      color: 'red',
      fontStyle: 'italic !important',
    },

    logo_left: {
      width: 70,
      height: 70,
      marginRight: 10,
      top: 0,
      position: 'absolute',
      left: 5,
    },
    logo_right_1: {
      width: 70,
      height: 70,
      marginRight: 10,
      top: 0,
      position: 'absolute',
      right: 50,
    },
    logo_right_2: {
      width: 80,
      height: 80,
      marginRight: 10,
      top: 0,
      position: 'absolute',
      right: -15,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    description: {
      fontSize: 24,
      textAlign: 'center',
      fontFamily: 'Open Sans',
      fontWeight: 'bolder',
      // backgroundColor: '#5FBDFF',
      // textAlign: 'center',
      // marginBottom: '10px',
      // fontSize: '18pt',
      // paddingTop: '3px',
      // paddingBottom: '3px',
    },

    recommended: {
      fontSize: '11pt',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
      marginTop: 30,
    },
    chairpersion: {
      borderTop: 1,
      borderTopColor: 'black',
      width: 200,
      textAlign: 'center',
      marginLeft: 50,
      marginTop: 40,
      fontSize: '11pt',
      flexDirection: 'column',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: '8pt',
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },

    inBehalf: {
      flexDirection: 'row',
      fontSize: '10pt',
    },
    cityMayor: {
      textAlign: 'center',
      borderTop: 1,
      borderTopColor: 'black',
      flexDirection: 'column',
      marginLeft: 140,
      width: 180,
    },

    footer: {
      color: 'grey',
      position: 'absolute',
      bottom: 20,
      left: 10,
      right: 20,
      textAlign: 'center',
      paddingTop: 10,
      fontSize: '8pt',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    tableHeader: {
      display: 'flex',
      flexDirection: 'row',
      textAlign: 'center',
      paddingTop: 5,
      paddingBottom: 5,
      fontSize: '11pt',
      // backgroundColor: 'blue',
      // color: 'white',
      fontFamily: 'Roboto',
      fontWeight: 800,
    },
    tableData: {
      display: 'flex',
      flexDirection: 'row',
      textAlign: 'center',
      borderBottom: '0.4px solid grey',
      paddingTop: 3,
      paddingBottom: 3,
      fontSize: '10pt',
      flexWrap: 'wrap',
      wordWrap: 'break-word',
    },
  })

  Font.register({
    family: 'Open Sans',
    fonts: [
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Open_Sans/OpenSans-Regular-webfont.ttf',
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Open_Sans/OpenSans-Bold-webfont.ttf',
        fontWeight: 'bold',
      },
    ],
  })

  Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
        fontWeight: 'bolder',
      },
    ],
  })
  const col = [
    'id',
    'control_number',
    'purchase_date',
    'plate_number',
    'model',
    'driver',
    'office',
    'purposes',
    'product_type',
    'fuel_price',
    'wuantity',
    'gross',
    'amount',
  ]

  return (
    <>
      <ToastContainer />

      <PageTitle pageTitle={cardTitle} />
      <CCard className="mb-4">
        <CCardBody>
          <CNav variant="tabs" layout="justified">
            <CNavItem role="presentation">
              <CNavLink
                active={activeKey === 1}
                component="button"
                role="tab"
                aria-controls="tab-1"
                aria-selected={activeKey === 1}
                onClick={() => {
                  setActiveKey(1)
                  toast.dismiss()
                }}
              >
                Monthly Report
              </CNavLink>
            </CNavItem>
            {/* <CNavItem role="presentation">
              <CNavLink
                active={activeKey === 2}
                component="button"
                role="tab"
                aria-controls="tab-2"
                aria-selected={activeKey === 2}
                onClick={() => {
                  setActiveKey(2)
                  toast.dismiss()
                }}
              >
                Daily Fuel Pump Dispensed
              </CNavLink>
            </CNavItem>
            <CNavItem role="presentation">
              <CNavLink
                active={activeKey === 3}
                component="button"
                role="tab"
                aria-controls="tab-3"
                aria-selected={activeKey === 3}
                onClick={() => {
                  setActiveKey(3)
                  toast.dismiss()
                }}
              >
                Daily Oil & Lubricant Request
              </CNavLink>
            </CNavItem> */}
            <CNavItem role="presentation">
              <CNavLink
                active={activeKey === 4}
                component="button"
                role="tab"
                aria-controls="tab-4"
                aria-selected={activeKey === 4}
                onClick={() => {
                  setActiveKey(4)
                  toast.dismiss()
                }}
              >
                Daily Fuel Consumption Report
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane
              role="tabpanel"
              aria-labelledby="tab-1"
              visible={activeKey === 1}
              style={{ position: 'relative' }}
            >
              <MonthlyReport />
            </CTabPane>
            <CTabPane
              role="tabpanel"
              aria-labelledby="tab-2"
              visible={activeKey === 2}
              style={{ position: 'relative' }}
            >
              2
            </CTabPane>
            <CTabPane
              role="tabpanel"
              aria-labelledby="tab-3"
              visible={activeKey === 3}
              style={{ position: 'relative' }}
            >
              3
            </CTabPane>
            <CTabPane
              role="tabpanel"
              aria-labelledby="tab-4"
              visible={activeKey === 4}
              style={{ position: 'relative' }}
            >
              <DailyFuelConsumptionReport />
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Report
