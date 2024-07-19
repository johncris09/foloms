import React, { useRef, useState } from 'react'
import Select from 'react-select'
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
import monthlyReportTemplate1 from './../../assets/images/template/monthly_report 1.png'
import monthlyReportTemplate2 from './../../assets/images/template/monthly_report 2.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { CButton, CCol, CForm, CFormLabel, CFormText, CRow, CSpinner } from '@coreui/react'
import { api, officer, requiredField } from 'src/components/SystemConfiguration'
import { format, parse } from 'date-fns'
import { CDateRangePicker } from '@coreui/react-pro'
import PageTitle from 'src/components/PageTitle'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'

const MonthlyReport = ({ cardTitle }) => {
  const user = jwtDecode(localStorage.getItem('folomsToken'))
  const reportTypeInputRef = useRef()

  const filter = useFormik({
    initialValues: {
      start_date: '',
      end_date: '',
      report_type: '',
    },
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      await monthlyReport.mutate(values)
    },
  })

  const monthlyReport = useMutation({
    mutationKey: ['monthlyReport'],
    mutationFn: async (values) => {
      return await api.get('monthly_report/filter', { params: values })
    },
    onSuccess: async (response) => {
      if (response.data.length) {
        console.info(response.data)
        return response.data
      } else {
        toast.error('No Records Found!')
      }
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const reportTypeReport = useQuery({
    queryFn: async () =>
      await api.get('report_type').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.type} - ${item.description}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['reportTypeReport'],
    staleTime: Infinity,
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

  const styles = StyleSheet.create({
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
  })

  const customRanges = {
    Today: [new Date(), new Date()],
    Yesterday: [
      new Date(new Date().setDate(new Date().getDate() - 1)),
      new Date(new Date().setDate(new Date().getDate() - 1)),
    ],
    'Last 7 Days': [new Date(new Date().setDate(new Date().getDate() - 6)), new Date(new Date())],
    'Last 30 Days': [new Date(new Date().setDate(new Date().getDate() - 29)), new Date(new Date())],
    'This Month': [
      new Date(new Date().setDate(1)),
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    ],
    'Last Month': [
      new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    ],
  }

  const handleSelectChange = (selectedOption, ref) => {
    filter.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }
  return (
    <>
      <ToastContainer />
      <PageTitle pageTitle={cardTitle} />
      <CRow>
        <CCol md={4}>
          <h6>Filter</h6>
          <CForm onSubmit={filter.handleSubmit}>
            <CDateRangePicker
              required
              ranges={customRanges}
              label={requiredField('Date')}
              locale="en-US"
              footer
              value={filter.values.purchase_date}
              onStartDateChange={(date) => filter.setFieldValue('start_date', date)}
              onEndDateChange={(date) => filter.setFieldValue('end_date', date)}
              inputDateParse={(date) => parse(date, 'MMMM dd, yyyy', new Date())}
              inputDateFormat={(date) => format(new Date(date), 'MMMM dd, yyyy')}
            />
            <CFormLabel>
              {
                <>
                  {reportTypeReport.isLoading && <CSpinner size="sm" />}
                  {requiredField('Report type')}
                </>
              }
            </CFormLabel>
            <Select
              ref={reportTypeInputRef}
              value={
                !reportTypeReport.isLoading &&
                reportTypeReport.data?.find((option) => option.value === filter.values.report_type)
              }
              onChange={handleSelectChange}
              options={!reportTypeReport.isLoading && reportTypeReport.data}
              name="report_type"
              isSearchable
              placeholder="Search..."
              isClearable
              required
            />
            {filter.touched.report_type && filter.errors.report_type && (
              <CFormText className="text-danger">{filter.errors.report_type}</CFormText>
            )}
            <div className="d-grid gap-2 d-md-flex mt-3 justify-content-md-end">
              <CButton type="submit" size="sm" variant="outline" color="primary">
                <FontAwesomeIcon icon={faFilter} /> Filter
              </CButton>
            </div>
          </CForm>
        </CCol>
        <CCol md={8}>
          <h6>Print Preview</h6>
          {filter.values.report_type == 1 && (
            <PDFViewer width="100%" height="750px">
              <Document
                author={process.env.REACT_APP_DEVELOPER}
                title="Monthly Report"
                keywords="document, pdf"
                creator={process.env.REACT_APP_DEVELOPER}
                producer={process.env.REACT_APP_DEVELOPER}
                pdfVersion="1.3"
              >
                {monthlyReport?.data?.data?.map((row, index) => {
                  return (
                    <React.Fragment key={index}>
                      <Page>
                        <View style={{ position: 'relative' }}>
                          <Image src={monthlyReportTemplate1} />
                        </View>

                        <View
                          style={{
                            position: 'absolute',
                            top: 142,
                            left: 123,
                            width: 180,
                            height: 14,
                            justifyContent: 'center',
                            alignItems: 'left',
                            display: 'flex',
                          }}
                        >
                          <Text style={{ fontSize: 10 }}>
                            {row.plate_number} {row.model}
                          </Text>
                        </View>
                        <View
                          style={{
                            position: 'absolute',
                            top: 142,
                            left: 362,
                            width: 150,
                            height: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <Text style={{ fontSize: 10 }}></Text>
                        </View>
                        <View
                          style={{
                            position: 'absolute',
                            top: 155,
                            left: 400,
                            width: 145,
                            height: 14,
                            justifyContent: 'center',
                            alignItems: 'left',
                            display: 'flex',
                          }}
                        >
                          <Text style={{ fontSize: 10 }}>{row.driver_full_name}</Text>
                        </View>

                        {row.trip_ticket.map((trip_ticket_row, trip_ticket_index) => {
                          const topPosition = 240 + trip_ticket_index * 13

                          return (
                            <React.Fragment key={trip_ticket_index}>
                              <View
                                style={{
                                  position: 'absolute',
                                  top: topPosition,
                                  left: 40,
                                  width: 82,
                                  height: 14,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Text style={{ fontSize: 10 }}>
                                  {trip_ticket_row.purchase_date}
                                </Text>
                              </View>
                              <View
                                style={{
                                  position: 'absolute',
                                  top: topPosition,
                                  left: 122,
                                  width: 75,
                                  height: 14,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Text style={{ fontSize: 10 }}>
                                  {trip_ticket_row.approximate_distance_traveled}
                                </Text>
                              </View>
                              <View
                                style={{
                                  position: 'absolute',
                                  top: topPosition,
                                  left: 196,
                                  width: 75,
                                  height: 14,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Text style={{ fontSize: 10 }}>{trip_ticket_row.sub_total}</Text>
                              </View>

                              <View
                                style={{
                                  position: 'absolute',
                                  top: topPosition,
                                  left: 271,
                                  width: 67,
                                  height: 14,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Text style={{ fontSize: 10 }}>
                                  {trip_ticket_row.lubricating_oil_issued_purchased}
                                </Text>
                              </View>
                              <View
                                style={{
                                  position: 'absolute',
                                  top: topPosition,
                                  left: 338,
                                  width: 73,
                                  height: 14,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Text style={{ fontSize: 10 }}>
                                  {trip_ticket_row.grease_issued_purchased}
                                </Text>
                              </View>
                              <View
                                style={{
                                  position: 'absolute',
                                  top: topPosition,
                                  left: 411,
                                  width: 123,
                                  height: 14,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Text style={{ fontSize: 10 }}>{trip_ticket_row.purposes}</Text>
                              </View>
                            </React.Fragment>
                          )
                        })}
                        <View
                          style={{
                            position: 'absolute',
                            bottom: 265,
                            left: 122,
                            width: 75,
                            height: 14,
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <Text style={{ fontSize: 10 }}>
                            {row.total_approximate_distance_traveled}
                          </Text>
                        </View>

                        <View
                          style={{
                            position: 'absolute',
                            bottom: 265,
                            left: 196,
                            width: 75,
                            height: 14,
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <Text style={{ fontSize: 10 }}>{row.total_purchased}</Text>
                        </View>

                        <View
                          style={{
                            position: 'absolute',
                            bottom: 265,
                            left: 271,
                            width: 67,
                            height: 14,
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <Text style={{ fontSize: 10 }}>
                            {row.total_lubricating_oil_issued_purchased}
                          </Text>
                        </View>
                        <View
                          style={{
                            position: 'absolute',
                            bottom: 265,
                            left: 338,
                            width: 73,
                            height: 14,
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <Text style={{ fontSize: 10 }}>{row.total_grease_issued_purchased}</Text>
                        </View>
                        <View
                          style={{
                            position: 'absolute',
                            bottom: 175,
                            left: 40,
                            width: 230,
                            height: 14,
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <Text style={{ fontSize: 10 }}>{officer}</Text>
                        </View>

                        <View
                          style={{
                            position: 'absolute',
                            bottom: 178,
                            left: 320,
                            width: 230,
                            height: 14,
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <Text style={{ fontSize: 10 }}>{row.driver_full_name}</Text>
                        </View>

                        <View style={styles.footer}>
                          <Text>
                            Printed by: {user.first_name} {user.middle_name} {user.last_name}{' '}
                            {user.suffix}
                          </Text>
                          <Text>Printed on: {new Date().toLocaleString()}</Text>
                        </View>
                      </Page>
                    </React.Fragment>
                  )
                })}
              </Document>
            </PDFViewer>
          )}
          {filter.values.report_type == 2 && (
            <PDFViewer width="100%" height="750px">
              <Document
                author={process.env.REACT_APP_DEVELOPER}
                title="Monthly Report"
                keywords="document, pdf"
                creator={process.env.REACT_APP_DEVELOPER}
                producer={process.env.REACT_APP_DEVELOPER}
                pdfVersion="1.3"
              >
                {monthlyReport?.data?.data?.map((row, index) => {
                  return (
                    <React.Fragment key={index}>
                      <Page>
                        <View style={{ position: 'relative' }}>
                          <Image src={monthlyReportTemplate2} />
                        </View>

                        {row.trip_ticket.map((trip_ticket_row, trip_ticket_index) => {
                          const topPosition = 240 + trip_ticket_index * 13

                          return (
                            <React.Fragment key={trip_ticket_index}>
                              <View
                                style={{
                                  position: 'absolute',
                                  top: topPosition,
                                  left: 40,
                                  width: 122,
                                  height: 14,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Text style={{ fontSize: 10 }}>
                                  {trip_ticket_row.plate_number} {trip_ticket_row.model}
                                </Text>
                              </View>
                              <View
                                style={{
                                  position: 'absolute',
                                  top: topPosition,
                                  left: 159,
                                  width: 66,
                                  height: 14,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Text style={{ fontSize: 10 }}>
                                  {trip_ticket_row.purchase_date}
                                </Text>
                              </View>
                              <View
                                style={{
                                  position: 'absolute',
                                  top: topPosition,
                                  left: 226,
                                  width: 64,
                                  height: 14,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Text style={{ fontSize: 10 }}>
                                  {trip_ticket_row.departure_time}
                                </Text>
                              </View>

                              <View
                                style={{
                                  position: 'absolute',
                                  top: topPosition,
                                  left: 290,
                                  width: 63,
                                  height: 14,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Text style={{ fontSize: 10 }}>
                                  {trip_ticket_row.arrival_time_back}
                                </Text>
                              </View>
                              <View
                                style={{
                                  position: 'absolute',
                                  top: topPosition,
                                  left: 338,
                                  width: 73,
                                  height: 14,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Text style={{ fontSize: 10 }}>
                                  {trip_ticket_row.grease_issued_purchased}
                                </Text>
                              </View>
                              <View
                                style={{
                                  position: 'absolute',
                                  top: topPosition,
                                  left: 451,
                                  width: 95,
                                  height: 14,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Text style={{ fontSize: 10 }}>
                                  {trip_ticket_row.total_purchased} L
                                </Text>
                              </View>
                            </React.Fragment>
                          )
                        })}

                        <View
                          style={{
                            position: 'absolute',

                            bottom: 228,
                            left: 65,
                            width: 205,
                            height: 14,
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <Text style={{ fontSize: 10 }}>{officer}</Text>
                        </View>

                        <View
                          style={{
                            position: 'absolute',
                            bottom: 228,
                            left: 360,
                            width: 180,
                            height: 14,
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <Text style={{ fontSize: 10 }}>{row.driver_full_name}</Text>
                        </View>

                        {/* <View
                        style={{
                          position: 'absolute',
                          bottom: 160,
                          left: 40,
                          width: 230,
                          height: 14,
                          justifyContent: 'center',
                          alignItems: 'center',
                          display: 'flex',
                        }}
                      >
                        <Text style={{ fontSize: 10 }}>{position}</Text>
                      </View> */}

                        <View style={styles.footer}>
                          <Text>Printed by: John Doe</Text>

                          <Text>Printed on: {new Date().toLocaleString()}</Text>
                        </View>
                      </Page>
                    </React.Fragment>
                  )
                })}
              </Document>
            </PDFViewer>
          )}
        </CCol>
      </CRow>
    </>
  )
}

export default MonthlyReport
