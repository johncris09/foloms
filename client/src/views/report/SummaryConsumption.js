import React, { useState, useCallback } from 'react'
import { utils, writeFile } from 'xlsx'
import { format, parse } from 'date-fns'
import { CDatePicker } from '@coreui/react-pro'
import { ToastContainer } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { api } from 'src/components/SystemConfiguration'
import { CButton, CCard, CCardBody, CCol, CForm, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer'
import PageTitle from 'src/components/PageTitle'

const SummaryConsumption = ({ cardTitle }) => {
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
    },
  })

  const filterSummaryConsumption = useMutation({
    mutationKey: ['filterSummaryConsumption'],
    mutationFn: async (values) => {
      return await api.get('summary_consumption/filter', { params: values })
    },
    onSuccess: async (response) => {
      const data = response.data.summary_consumption
      const dividedArray = chunkArray(data, parseInt(rowsPerPage))
      setChunks(dividedArray)
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
      <CRow>
        <CCol md={4}>
          <CCard className="mb-4">
            <CCardBody>
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

                {/* {filter.touched.course && filter.errors.course && (
                  <CFormText className="text-danger">{filter.errors.course}</CFormText>
                )} */}
                <div className="d-grid gap-2 d-md-flex mt-3 justify-content-md-end">
                  <CButton type="submit" size="sm" variant="outline" color="primary">
                    <FontAwesomeIcon icon={faFilter} /> Filter
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={8}>
          {/* <ReactPdfTable.TableRow>
            <ReactPdfTable.TableCell text="Cell 1" align="right" />
            <ReactPdfTable.TableCell text="Cell 1" align="center" />
            <ReactPdfTable.TableCell text="Cell 1" align="left" />
          </ReactPdfTable.TableRow> */}
          <PDFViewer width="100%" height="800px%">
            <Document
              // size="A4"
              // orientation="landscape"
              author={process.env.REACT_APP_DEVELOPER}
              // title="Senior High Applicants" keywords="document, pdf" // subject={title}
              // creator={process.env.REACT_APP_DEVELOPER}
              // producer={process.env.REACT_APP_DEVELOPER}
              pdfVersion="1.3"
            >
              {chunks.map((chunk, index) => (
                <Page key={index} orientation="landscape" size="A4">
                  <View style={styles.description} fixed>
                    <Text>SUMMARY OF DAILY FUEL PUMP DISPENSED</Text>
                  </View>
                  <View style={styles.tableHeader} fixed>
                    {col.map((c, index) => (
                      <>
                        {c === 'id' && (
                          <Text
                            key={index}
                            style={{
                              width: `${40 / col.length}%`,
                            }}
                          >
                            Seq. No.
                          </Text>
                        )}
                        {c === 'control_number' && (
                          <Text
                            key={index}
                            style={{
                              width: `${40 / col.length}%`,
                            }}
                          >
                            Control #
                          </Text>
                        )}
                        {c === 'purchase_date' && (
                          <Text
                            key={index}
                            style={{
                              width: `${40 / col.length}%`,
                            }}
                          >
                            Date
                          </Text>
                        )}
                        {c === 'plate_number' && (
                          <Text
                            key={index}
                            style={{
                              width: `${40 / col.length}%`,
                            }}
                          >
                            Plate Number
                          </Text>
                        )}
                        {c === 'model' && (
                          <Text
                            key={index}
                            style={{
                              width: `${40 / col.length}%`,
                            }}
                          >
                            Vehicle Type
                          </Text>
                        )}

                        {c === 'driver' && (
                          <Text
                            key={index}
                            style={{
                              width: `${40 / col.length}%`,
                            }}
                          >
                            Driver
                          </Text>
                        )}

                        {c === 'office' && (
                          <Text
                            key={index}
                            style={{
                              width: `${40 / col.length}%`,
                            }}
                          >
                            office
                          </Text>
                        )}

                        {c === 'purposes' && (
                          <Text
                            key={index}
                            style={{
                              width: `${40 / col.length}%`,
                            }}
                          >
                            Purposes
                          </Text>
                        )}

                        {c === 'product_type' && (
                          <Text
                            key={index}
                            style={{
                              width: `${40 / col.length}%`,
                            }}
                          >
                            Product Type
                          </Text>
                        )}

                        {c === 'fuel_price' && (
                          <Text
                            key={index}
                            style={{
                              width: `${40 / col.length}%`,
                            }}
                          >
                            Fuel Price
                          </Text>
                        )}
                        {c === 'wuantity' && (
                          <Text
                            key={index}
                            style={{
                              width: `${40 / col.length}%`,
                            }}
                          >
                            Quantity (L)
                          </Text>
                        )}
                        {c === 'gross' && (
                          <Text
                            key={index}
                            style={{
                              width: `${40 / col.length}%`,
                            }}
                          >
                            Gross
                          </Text>
                        )}

                        {c === 'amount' && (
                          <Text
                            key={index}
                            style={{
                              width: `${40 / col.length}%`,
                            }}
                          >
                            Amount
                          </Text>
                        )}
                      </>
                    ))}
                  </View>
                  {chunk.map((rowData, rowIndex) => (
                    <View key={rowIndex} style={styles.tableData}>
                      {col.map((c) => (
                        <>
                          {c === 'id' && (
                            <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}>
                              {index * rowsPerPage + rowIndex + 1}
                            </Text>
                          )}
                          {c === 'control_number' && (
                            <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}>
                              {rowData[c]}
                            </Text>
                          )}
                          {c === 'purchase_date' && (
                            <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}>
                              {rowData[c]}
                            </Text>
                          )}
                          {c === 'plate_number' && (
                            <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}>
                              {rowData[c]}
                            </Text>
                          )}
                          {c === 'model' && (
                            <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}>
                              {rowData[c]}
                            </Text>
                          )}
                          {c === 'driver' && (
                            <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}>
                              {rowData['first_name']}
                            </Text>
                          )}
                          {c === 'office' && (
                            <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}>
                              {rowData['abbr']}
                            </Text>
                          )}
                          {c === 'purposes' && (
                            <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}>
                              {rowData[c]}
                            </Text>
                          )}
                          {c === 'product_type' && (
                            <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}>
                              {rowData['product']}
                            </Text>
                          )}
                          {c === 'fuel_price' && (
                            <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}></Text>
                          )}
                          {c === 'wuantity' && (
                            <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}>
                              {rowData['gasoline_purchased']}
                            </Text>
                          )}
                          {c === 'gross' && (
                            <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}></Text>
                          )}
                          {c === 'amount' && (
                            <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}></Text>
                          )}
                          {/* {c === 'name' && (
                            <Text key={rowIndex} style={{ width: `${250 / col.length}%` }}>
                              {`${toSentenceCase(rowData.lastname)}, ${toSentenceCase(
                                rowData.firstname,
                              )} ${
                                rowData.middlename.length === 1
                                  ? rowData.middlename + '.'
                                  : rowData.middlename.length > 1
                                  ? rowData.middlename.substring(0, 1) + '.'
                                  : ''
                              } ${rowData.suffix}`}
                            </Text>
                          )}
                          {c === 'address' && (
                            <Text key={rowIndex} style={{ width: `${150 / col.length}%` }}>
                              {rowData[c]}
                            </Text>
                          )}
                          {c === 'strand' && (
                            <Text key={rowIndex} style={{ width: `${80 / col.length}%` }}>
                              {rowData[c]}
                            </Text>
                          )}
                          {c === 'school' && (
                            <Text key={rowIndex} style={{ width: `${80 / col.length}%` }}>
                              {rowData.abbreviation}
                            </Text>
                          )}
                          {c === 'availment' && (
                            <Text key={rowIndex} style={{ width: `${100 / col.length}%` }}>
                              {rowData[c]}
                            </Text>
                          )} */}
                        </>
                      ))}
                    </View>
                  ))}

                  {/* <View>
                    {index === totalChunks - 1 && (
                      <>
                        <View style={styles.recommended}>
                          <Text>Recommended for Approval:</Text>
                          <Text style={{ marginRight: 180 }}>Approved:</Text>
                        </View>
                        <View style={styles.inBehalf}>
                          <Text>In behalf of the City Scholarship Screening Committee</Text>
                          <View style={styles.cityMayor}>
                            <Text>{cityMayor}</Text>
                            <Text style={{ textAlign: 'center', fontSize: 10 }}>City Mayor</Text>
                          </View>
                        </View>
                        <View style={styles.chairpersion}>
                          <Text>{commiteeChairperson}</Text>
                          <Text style={{ fontSize: 10 }}>Commitee Chairperson</Text>
                        </View>
                      </>
                    )}
                  </View> */}

                  <Text
                    style={styles.pageNumber}
                    render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                    fixed
                  />
                  <View style={styles.footer}>
                    <Text>Printed by: John Doe</Text>

                    <Text>Printed on: {new Date().toLocaleString()}</Text>
                  </View>
                </Page>
              ))}
            </Document>
          </PDFViewer>

          {/* {JSON.stringify(filterSummaryConsumption?.data?.data)} */}
          {/* <CCard className="mb-4">
            <CCardBody>
              <h6>Print Preview</h6>
              <CTable
                responsive
                style={{
                  whiteSpace: 'nowrap',
                  overflowY: 'auto',
                  // overflowX: 'scroll',
                  height: '10px',
                }}
              >
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Seq. No.</CTableHeaderCell>
                    <CTableHeaderCell>CONTROL No.</CTableHeaderCell>
                    <CTableHeaderCell>DATE</CTableHeaderCell>
                    <CTableHeaderCell>PLATE Number</CTableHeaderCell>
                    <CTableHeaderCell>TYPE OF VEHICLE</CTableHeaderCell>
                    <CTableHeaderCell>Driver</CTableHeaderCell>
                    <CTableHeaderCell>OFFICE</CTableHeaderCell>
                    <CTableHeaderCell>PURPOSE</CTableHeaderCell>
                    <CTableHeaderCell>PRODUCT TYPE</CTableHeaderCell>
                    <CTableHeaderCell>FUEL PRICE</CTableHeaderCell>
                    <CTableHeaderCell>QUANTITY (LITERS)</CTableHeaderCell>
                    <CTableHeaderCell>GROSS</CTableHeaderCell>
                    <CTableHeaderCell>AMOUNT</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filterSummaryConsumption?.data?.data?.summary_consumption.map((row, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
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

                          const controlNumber = row.control_number || 0
                          const formattedControlNumber = String(controlNumber).padStart(4, '0')

                          return `${
                            formattedDate ? formattedDate + '-' : ''
                          }${formattedControlNumber}`
                        })()}
                      </CTableDataCell>

                      <CTableDataCell>
                        {(() => {
                          const purchaseDate = row.purchase_date // Assuming the format is YYYY-MM-DD
                          let formattedDate = ''

                          if (purchaseDate) {
                            const [year, month, day] = purchaseDate.split('-')
                            if (year && month && day) {
                              formattedDate = `${month}/${day}/${year}`
                            }
                          }
                          return formattedDate
                        })()}
                      </CTableDataCell>
                      <CTableDataCell>{row.plate_number}</CTableDataCell>
                      <CTableDataCell>{row.model}</CTableDataCell>
                      <CTableDataCell>{`${row.first_name} ${
                        row.middle_name
                          ? row.middle_name.length === 1
                            ? row.middle_name + '.'
                            : row.middle_name.substring(0, 1) + '.'
                          : ''
                      } ${row.last_name} ${row.suffix ? row.suffix : ''}`}</CTableDataCell>
                      <CTableDataCell>{row.abbr}</CTableDataCell>
                      <CTableDataCell>{row.purposes}</CTableDataCell>
                      <CTableDataCell>{row.product}</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell>{row.gasoline_purchased}</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <CTable responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Product</CTableHeaderCell>
                    <CTableHeaderCell>TOTAL LITERS</CTableHeaderCell>
                    <CTableHeaderCell>TOTAL AMOUNT</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filterSummaryConsumption?.data?.data?.product_summary_consumption.map(
                    (row, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{row.product}</CTableDataCell>
                        <CTableDataCell>{row.total_purchase}</CTableDataCell>
                        <CTableDataCell></CTableDataCell>
                      </CTableRow>
                    ),
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard> */}
        </CCol>
      </CRow>
    </>
  )
}

export default SummaryConsumption
