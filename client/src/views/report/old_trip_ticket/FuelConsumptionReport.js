import React, { useState } from 'react'
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer'
import { CButton, CCol, CForm, CFormInput, CFormSelect, CRow } from '@coreui/react'
import { useMutation } from '@tanstack/react-query'
import { api, months, requiredField } from 'src/components/SystemConfiguration'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { jwtDecode } from 'jwt-decode'
const BORDER_COLOR = '#bfbfbf'
const BORDER_STYLE = 'solid'
const NUM_COLUMNS = 12
const COL1_WIDTH = 10
const COLN_WIDTH = (100 - 12) / (NUM_COLUMNS - 3.2)

// const COLN_WIDTH = (100 - NUM_COLUMNS) / 3
const FuelConsumptionReport = ({ cardTitle }) => {
  const user = jwtDecode(localStorage.getItem('folomsToken'))
  const [totalChunks, setTotalChunks] = useState(2)

  const [filterTitle, setFilterTitle] = useState('')
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
    tableCellHeader: {
      margin: 5,
      fontSize: 12,
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
      fontSize: 13,
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

  const headers1 = ['', 'Diesel', 'Premium', 'Regular']
  const headers2 = [
    'Date',
    'Delivery',
    'Consumption',
    'Balance',
    'Delivery',
    'Consumption',
    'Balance',
    'Delivery',
    'Consumption',
    'Balance',
  ]
  const filter = useFormik({
    initialValues: {
      month: '',
      year: '',
    },
    onSubmit: async (values) => {
      setFilterTitle('Month of ' + months[values.month - 1]?.name + ', ' + values.year)
      await filterSummaryConsumption.mutate(values)
    },
  })

  const filterSummaryConsumption = useMutation({
    mutationKey: ['filterSummaryConsumption'],
    mutationFn: async (values) => {
      return await api.get('old_trip_ticket/transaction_filter', { params: values })
    },
    onSuccess: async (response) => {
      if (response.data.length > 0 || response.data.length > 0) {
        const data = response.data
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

  const getColumnStyle = (index) => {
    switch (index) {
      case 0:
        return {
          width: `${COL1_WIDTH}%`,
          borderStyle: BORDER_STYLE,
          borderColor: BORDER_COLOR,
          borderBottomColor: '#000',
          borderWidth: 1,
          borderLeftWidth: 0,
          borderTopWidth: 0,
        }
      case 1:
        return {
          width: `30%`,
          borderStyle: BORDER_STYLE,
          borderColor: BORDER_COLOR,
          borderBottomColor: '#000',
          borderWidth: 1,
          borderLeftWidth: 0,
          borderTopWidth: 0,
        }
      case 2:
        return {
          width: `30%`,
          borderStyle: BORDER_STYLE,
          borderColor: BORDER_COLOR,
          borderBottomColor: '#000',
          borderWidth: 1,
          borderLeftWidth: 0,
          borderTopWidth: 0,
        }
      case 3:
        return {
          width: `30%`,
          borderStyle: BORDER_STYLE,
          borderColor: BORDER_COLOR,
          borderBottomColor: '#000',
          borderWidth: 1,
          borderLeftWidth: 0,
          borderTopWidth: 0,
        }
      default:
        return styles.tableCol
    }
  }
  let totalDieselDelivery = 0
  let totalDieselConsumption = 0
  let totalDieselBalance = 0
  let totalPremiumDelivery = 0
  let totalPremiumConsumption = 0
  let totalPremiumBalance = 0
  let totalRegularDelivery = 0
  let totalRegularConsumption = 0
  let totalRegularBalance = 0
  const startYear = 2024
  const currentYear = new Date().getFullYear()
  const years = []

  for (let year = startYear; year <= currentYear + 1; year++) {
    years.push(year)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    filter.setFieldValue(name, value)
  }

  return (
    <CRow>
      <CCol md={4}>
        <h6>Filter</h6>
        <CForm onSubmit={filter.handleSubmit}>
          <CFormSelect name="month" label="Month" onChange={handleInputChange} required>
            <option value="">Select</option>
            {months.map((month, index) => (
              <option key={index} value={month.number}>
                {month.name}
              </option>
            ))}
          </CFormSelect>
          <CFormSelect name="year" label="Year" onChange={handleInputChange} required>
            <option value="">Select</option>
            <option value="2023">2023</option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </CFormSelect>

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
              return (
                <Page key={index} orientation="landscape" size="FOLIO" style={styles.body}>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <View style={styles.tableColSpan}>
                        <Text style={styles.documentTitle}>DAILY FUEL CONSUMPTION REPORT</Text>
                        <Text style={{ ...styles.documentTitle, fontSize: 14, marginBottom: 10 }}>
                          {filterTitle}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.tableRow}>
                      {headers1.map((header, headerIndex) => (
                        <View key={headerIndex} style={getColumnStyle(headerIndex)}>
                          <Text style={styles.tableCellHeader}>{header}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.tableRow}>
                      {headers2.map((header, headerIndex) => (
                        <View key={headerIndex} style={styles.tableCol}>
                          <Text style={styles.tableCellHeader}>{header}</Text>
                        </View>
                      ))}
                    </View>

                    {data.map((row, idx) => {
                      totalDieselDelivery += parseFloat(row.diesel_delivery)
                      totalDieselConsumption += parseFloat(row.diesel_consumption)
                      totalDieselBalance = row.diesel_balance
                      totalPremiumDelivery += parseFloat(row.premium_delivery)
                      totalPremiumConsumption += parseFloat(row.premium_consumption)
                      totalPremiumBalance = row.premium_balance
                      totalRegularDelivery += parseFloat(row.regular_delivery)
                      totalRegularConsumption += parseFloat(row.regular_consumption)
                      totalRegularBalance = row.regular_balance
                      return (
                        <React.Fragment key={idx}>
                          <View style={idx % 2 === 0 ? styles.tableRow : styles.tableRowStriped}>
                            <View style={styles.tableCol}>
                              <Text style={styles.tableCell}>{row.date}</Text>
                            </View>
                            <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                              <Text style={styles.tableCell}>
                                {row.diesel_delivery.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </View>
                            <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                              <Text style={styles.tableCell}>
                                {row.diesel_consumption.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </View>
                            <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                              <Text style={styles.tableCell}>
                                {row.diesel_balance.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </View>
                            <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                              <Text style={styles.tableCell}>
                                {row.premium_delivery.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </View>
                            <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                              <Text style={styles.tableCell}>
                                {row.premium_consumption.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </View>
                            <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                              <Text style={styles.tableCell}>
                                {row.premium_balance.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </View>
                            <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                              <Text style={styles.tableCell}>
                                {row.regular_delivery.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </View>
                            <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                              <Text style={styles.tableCell}>
                                {row.regular_consumption.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </View>
                            <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                              <Text style={styles.tableCell}>
                                {row.regular_balance.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </View>
                          </View>
                        </React.Fragment>
                      )
                    })}

                    <View style={{ ...styles.tableRow, fontWeight: 'bold', fontFamily: 'Roboto' }}>
                      <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                        <Text style={styles.tableCell}>TOTAL</Text>
                      </View>
                      <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                        <Text style={styles.tableCell}>
                          {totalDieselDelivery.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Text>
                      </View>
                      <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                        <Text style={styles.tableCell}>
                          {totalDieselConsumption.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Text>
                      </View>
                      <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                        <Text style={styles.tableCell}>{totalDieselBalance}</Text>
                      </View>
                      <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                        <Text style={styles.tableCell}>
                          {totalPremiumDelivery.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Text>
                      </View>
                      <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                        <Text style={styles.tableCell}>
                          {totalPremiumConsumption.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Text>
                      </View>
                      <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                        <Text style={styles.tableCell}>
                          {totalPremiumBalance.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Text>
                      </View>
                      <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                        <Text style={styles.tableCell}>
                          {totalRegularDelivery.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Text>
                      </View>
                      <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                        <Text style={styles.tableCell}>
                          {totalRegularConsumption.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Text>
                      </View>
                      <View style={{ ...styles.tableCol, textAlign: 'right' }}>
                        <Text style={styles.tableCell}>
                          {totalRegularBalance.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text
                    style={styles.pageNumber}
                    render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                    fixed
                  />
                  <View style={styles.footer}>
                    <Text>
                      Printed by: {user.first_name} {user.middle_name} {user.last_name}{' '}
                      {user.suffix}
                    </Text>
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

export default FuelConsumptionReport
