import React, { useState } from 'react'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
  Image,
  Svg,
  Line,
} from '@react-pdf/renderer'
import { CButton, CCol, CForm, CFormInput, CRow } from '@coreui/react'

import { format, parse } from 'date-fns'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  officer,
  position,
  requiredField,
  toSentenceCase,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import * as Yup from 'yup'
import { CDatePicker, CDateRangePicker } from '@coreui/react-pro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
const BORDER_COLOR = '#bfbfbf'
const BORDER_STYLE = 'solid'
const NUM_COLUMNS = 12
const COL1_WIDTH = 10
const COLN_WIDTH = (100 - 12) / (NUM_COLUMNS - 3)

// const COLN_WIDTH = (100 - NUM_COLUMNS) / 3
const DailyFuelConsumptionReport = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [totalChunks, setTotalChunks] = useState(2)
  const [summary, setSummary] = useState([])

  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [chunks, setChunks] = useState([])
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

  const styles = StyleSheet.create({
    body: {
      padding: 10,
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      textAlign: 'center',
      margin: 'auto',
      flexDirection: 'row',
    },
    tableRowStriped: {
      textAlign: 'center',
      margin: 'auto',
      flexDirection: 'row',
      backgroundColor: '#f2f2f2',
    },
    tableColHeader: {
      width: `${COL1_WIDTH}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderBottomColor: '#000',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColSpan: {
      width: '100%',
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderBottomColor: '#000',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      textAlign: 'center',
    },

    tableColFooter: {
      textAlign: 'right',
      width: `${87}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: 12,
    },
    tableCol: {
      width: `${COLN_WIDTH}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCol1: {
      width: `${4}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCol2: {
      // control Number
      width: `${8}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCol3: {
      // Date
      width: `${7}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCol4: {
      // Plate Number
      width: `${8}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCol6: {
      // Driver
      width: `${14}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCol7: {
      // Office
      width: `${5}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCol8: {
      // Purpose
      width: `${19.2}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCol9: {
      // Product Type
      width: `${7}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCol10: {
      // Unit Cost
      width: `${5}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      textAlign: 'right',
    },
    tableCol11: {
      width: `${6}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCol12: {
      // Amount
      width: `${7}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCellHeader: {
      margin: 5,
      fontSize: 12,
      textAlign: 'center',
      fontFamily: 'Roboto',
      fontWeight: 'bold',
    },
    tableCellHeader1: {
      margin: 5,
      fontSize: 8,
      textAlign: 'center',
      fontFamily: 'Roboto',
      fontWeight: 'bold',
    },
    tableCellHeader4: {
      margin: 5,
      fontSize: 10,
      textAlign: 'center',
      fontFamily: 'Roboto',
      fontWeight: 'bold',
    },
    tableCellHeader9: {
      margin: 5,
      fontSize: 10,
      textAlign: 'center',
      fontFamily: 'Roboto',
      fontWeight: 'bold',
    },
    tableCellHeader11: {
      margin: 5,
      fontSize: 10,
      textAlign: 'center',
      fontFamily: 'Roboto',
      fontWeight: 'bold',
    },
    tableCellFooter: {
      width: `${8}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCell: {
      margin: 1,
      fontSize: 10,
    },
    tableFooter: {
      width: `${COLN_WIDTH * 10}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderTopWidth: 1,
      borderLeftWidth: 0,
      borderBottomWidth: 0,
      borderRightWidth: 0,
      textAlign: 'center',
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
    pageNumber: {
      position: 'absolute',
      fontSize: '8pt',
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },
  })

  // Create styles
  const styles2 = StyleSheet.create({
    page: {
      flexDirection: 'row',
      padding: 20,
    },
    column: {
      flex: 1,
      fontSize: 10,
      // alignItems: 'center',
      margin: 10,
    },
    preparedByContainer: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    preparedByText: {
      alignSelf: 'flex-start',
      textAlign: 'left',
    },
    name: {
      textAlign: 'center',
      fontFamily: 'Roboto',
      fontWeight: 'bold',
    },
    position: {
      textAlign: 'center',
    },
    summaryTableContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    summaryTable: {
      width: '100%',
      textAlign: 'center',
    },
    summaryHeader: {
      fontWeight: 'bold',
      fontSize: 14,
      fontFamily: 'Roboto',
      textAlign: 'center',
      marginBottom: 5,
    },

    table: {
      display: 'table',
      width: 'auto',
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      textAlign: 'center',
      margin: 'auto',
      flexDirection: 'row',
    },
    tableCol: {
      width: `${25}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColTotalAmount: {
      width: `${40}%`,
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCell: {
      margin: 1,
      fontSize: 10,
    },
  })
  const headers = [
    'Seq. No.',
    'Control No.',
    'Date',
    'Plate Number',
    'Vehicle Type',
    'Driver',
    'Office',
    'Purpose',
    'Product Type',
    'Unit Cost',
    'Quantity (Liters)',
    'Amount',
  ]
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
    },
  })

  const filterSummaryConsumption = useMutation({
    mutationKey: ['filterSummaryConsumption'],
    mutationFn: async (values) => {
      return await api.get('summary_consumption/filter', { params: values })
    },
    onSuccess: async (response) => {
      if (response.data.consumption.length > 0 || response.data.summary.length > 0) {
        setSummary(response.data.summary)
        const data = response.data.consumption
        const dividedArray = chunkArray(data, parseInt(rowsPerPage))
        setChunks(dividedArray)
        setTotalChunks(parseInt(dividedArray.length))
      } else {
        toast.error('No Records Found!')
        setChunks([])
        setTotalChunks(0)
      }
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const chunkArray = (arr, size) => {
    const slice = []
    for (let i = 0; i < arr.length; i += size) {
      slice.push(arr.slice(i, i + size))
    }

    return slice
  }

  const handleInputChange = (date) => {
    filter.setFieldValue('purchase_date', date)
  }

  const getColumnStyle = (index) => {
    switch (index) {
      case 0:
        return styles.tableCol1
      case 1:
        return styles.tableCol2
      case 2:
        return styles.tableCol3
      case 3:
        return styles.tableCol4
      case 5:
        return styles.tableCol6
      case 6:
        return styles.tableCol7
      case 7:
        return styles.tableCol8
      case 8:
        return styles.tableCol9
      case 9:
        return styles.tableCol10
      case 10:
        return styles.tableCol11
      case 11:
        return styles.tableCol12

      default:
        return styles.tableCol
    }
  }

  const getcustomHeader = (index) => {
    switch (index) {
      case 0:
        return styles.tableCellHeader1
      case 3:
        return styles.tableCellHeader4
      case 8:
        return styles.tableCellHeader9
      case 10:
        return styles.tableCellHeader11

      default:
        return styles.tableCellHeader
    }
  }
  return (
    <CRow>
      <CCol md={4}>
        <h6>Filter</h6>
        <CForm onSubmit={filter.handleSubmit}>
          <CDatePicker
            footer
            date="2024/06/18"
            label="Date"
            locale="en-US"
            name="purchase_date"
            value={filter.values.purchase_date}
            onDateChange={handleInputChange}
            inputDateParse={(date) => parse(date, 'MMMM dd, yyyy', new Date())}
            inputDateFormat={(date) => format(new Date(date), 'MMMM dd, yyyy')}
          />
          <CFormInput
            type="number"
            label={requiredField('Rows Per Page')}
            onChange={(e) => setRowsPerPage(e.target.value)}
            value={rowsPerPage}
            required
          />
          <div className="d-grid gap-2 d-md-flex mt-3 justify-content-md-end">
            <CButton
              type="submit"
              disabled={filterSummaryConsumption.isPending}
              size="sm"
              variant="outline"
              color="primary"
            >
              <FontAwesomeIcon icon={faFilter} />
              {filterSummaryConsumption.isPending ? 'Please Wait...' : 'Filter'}
            </CButton>
          </div>
        </CForm>
      </CCol>
      <CCol md={8}>
        <h6>Print Preview</h6>
        <PDFViewer width="100%" height="800px%">
          <Document>
            {chunks.map((data, index) => {
              let subTotal = 0
              let partialAmount = 0
              return (
                <Page key={index} orientation="landscape" size="FOLIO" style={styles.body}>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <View style={styles.tableColSpan}>
                        <Text style={styles.tableCellHeader}>
                          SUMMARY OF DAILY FUEL PUMP DISPENSED
                        </Text>
                      </View>
                    </View>

                    <View style={styles.tableRow}>
                      {headers.map((header, headerIndex) => (
                        <View key={headerIndex} style={getColumnStyle(headerIndex)}>
                          <Text style={getcustomHeader(headerIndex)}>{header}</Text>
                        </View>
                      ))}
                    </View>

                    {data.map((row, idx) => {
                      subTotal += parseFloat(row.gasoline_purchased)
                      partialAmount +=
                        parseFloat(row.gasoline_purchased) * parseFloat(row.unit_cost)
                      return (
                        <React.Fragment key={idx}>
                          <View style={idx % 2 === 0 ? styles.tableRow : styles.tableRowStriped}>
                            <View style={styles.tableCol1}>
                              <Text style={styles.tableCell}> {index * rowsPerPage + idx + 1}</Text>
                            </View>
                            <View style={styles.tableCol2}>
                              <Text style={styles.tableCell}>
                                {(() => {
                                  const purchaseDate = row.purchase_date // Assuming the format is YYYY-MM-DD
                                  let formattedDate = ''

                                  if (purchaseDate) {
                                    const [year, month, day] = purchaseDate.split('-')
                                    if (year && month && day) {
                                      const formattedYear = year.slice(2) // Get the last two digits of the year
                                      formattedDate = `${month}-${day}-${formattedYear}`
                                    }
                                  }

                                  const controlNumber = row.control_number
                                  const formattedControlNumber = String(controlNumber).padStart(
                                    4,
                                    '0',
                                  )

                                  return `${
                                    formattedDate ? formattedDate + '-' : ''
                                  }${formattedControlNumber}`
                                })()}
                              </Text>
                            </View>
                            <View style={styles.tableCol3}>
                              <Text style={styles.tableCell}>{row.purchase_date}</Text>
                            </View>
                            <View style={styles.tableCol4}>
                              <Text style={styles.tableCell}>{row.plate_number}</Text>
                            </View>
                            <View style={styles.tableCol}>
                              <Text style={styles.tableCell}>{row.model}</Text>
                            </View>
                            <View style={styles.tableCol6}>
                              <Text style={styles.tableCell}>{row.driver}</Text>
                            </View>

                            <View style={styles.tableCol7}>
                              <Text style={styles.tableCell}>{row.office}</Text>
                            </View>
                            <View style={styles.tableCol8}>
                              <Text style={styles.tableCell}>{row.purposes}</Text>
                            </View>
                            <View style={styles.tableCol9}>
                              <Text style={styles.tableCell}>{row.product}</Text>
                            </View>
                            <View style={styles.tableCol10}>
                              <Text style={styles.tableCell}>{row.unit_cost}</Text>
                            </View>
                            <View style={{ ...styles.tableCol11, textAlign: 'right' }}>
                              <Text style={styles.tableCell}>{row.gasoline_purchased}</Text>
                            </View>
                            <View style={{ ...styles.tableCol12, textAlign: 'right' }}>
                              <Text style={styles.tableCell}>{row.gross_amount}</Text>
                            </View>
                          </View>
                        </React.Fragment>
                      )
                    })}

                    <View style={styles.tableRow}>
                      <View style={styles.tableColFooter}>
                        <Text style={styles.tableCell}> SUB -TOTAL FUEL PUMP DISPENSED</Text>
                      </View>
                      <View
                        style={{
                          ...styles.tableCol11,
                          textAlign: 'right',
                          fontFamily: 'Roboto',
                          fontWeight: 'bold',
                        }}
                      >
                        <Text style={styles.tableCell}>
                          {subTotal.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Text>
                      </View>
                      <View
                        style={{
                          ...styles.tableCol12,
                          textAlign: 'right',
                          fontFamily: 'Roboto',
                          fontWeight: 'bold',
                        }}
                      >
                        <Text style={styles.tableCell}>
                          {partialAmount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View>
                    {index === totalChunks - 1 && (
                      <View style={styles2.page}>
                        <View style={styles2.column}>
                          <View style={styles2.preparedByContainer}>
                            <Text style={styles2.preparedByText}>
                              Prepared by:{'\n'}
                              {'\n'}
                              {'\n'}
                              {'\n'}
                            </Text>
                            <Text style={styles2.name}>JULIETA B. MANLAWE</Text>
                            <Svg height="10" width="495">
                              <Line
                                x1="150"
                                y1="5"
                                x2="350"
                                y2="5"
                                strokeWidth={2}
                                stroke="rgb(0,0,0)"
                              />
                            </Svg>
                            <Text style={styles2.position}>OCM Gasoline Officer Incharge </Text>
                          </View>
                        </View>
                        <View style={styles2.column}>
                          <View style={styles2.preparedByContainer}>
                            <Text style={styles2.preparedByText}>
                              Verified & Checked by:{'\n'}
                              {'\n'}
                              {'\n'}
                              {'\n'}
                            </Text>
                            <Text style={styles2.name}>JOEFELYN U. TUMULAK</Text>
                            <Svg height="10" width="495">
                              <Line
                                x1="160"
                                y1="5"
                                x2="340"
                                y2="5"
                                strokeWidth={2}
                                stroke="rgb(0,0,0)"
                              />
                            </Svg>
                            <Text style={styles2.position}>Property Inspector</Text>
                          </View>
                        </View>

                        <View style={styles2.summaryTableContainer}>
                          <View style={styles2.summaryTable}>
                            <Text style={styles2.summaryHeader} colSpan={4}>
                              Summary
                            </Text>
                          </View>

                          <View style={styles.table}>
                            <View style={styles2.tableRow}>
                              <View style={styles2.tableCol}>
                                <Text
                                  style={{
                                    ...styles2.tableCell,
                                    fontWeight: 'bold',
                                    fontFamily: 'Roboto',
                                  }}
                                >
                                  Product
                                </Text>
                              </View>
                              <View style={styles2.tableCol}>
                                <Text style={styles2.tableCell}>Total (L)</Text>
                              </View>
                              <View style={styles2.tableCol}>
                                <Text style={styles2.tableCell}>Unit Cost</Text>
                              </View>
                              <View style={styles2.tableColTotalAmount}>
                                <Text style={styles2.tableCell}>Total Amount</Text>
                              </View>
                            </View>

                            {summary.map((row, rowIndex) => {
                              return (
                                <View key={rowIndex} style={styles2.tableRow}>
                                  <View style={styles2.tableCol}>
                                    <Text style={styles2.tableCell}>{row.product}</Text>
                                  </View>
                                  <View style={styles2.tableCol}>
                                    <Text style={styles2.tableCell}>{row.total_purchase}</Text>
                                  </View>
                                  <View style={styles2.tableCol}>
                                    <Text style={styles2.tableCell}>{row.total_cost}</Text>
                                  </View>
                                  <View style={styles2.tableColTotalAmount}>
                                    <Text style={styles2.tableCell}>
                                      {(row.total_purchase * row.total_cost).toLocaleString(
                                        'en-US',
                                        {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        },
                                      )}
                                    </Text>
                                  </View>
                                </View>
                              )
                            })}
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                  <Text
                    style={styles.pageNumber}
                    render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                    fixed
                  />
                  <View style={styles.footer}>
                    <Text>Printed by: System User</Text>

                    <Text>Printed on: {new Date().toLocaleString()}</Text>
                  </View>
                </Page>
              )
            })}
          </Document>
        </PDFViewer>
      </CCol>
    </CRow>
  )
}

export default DailyFuelConsumptionReport
