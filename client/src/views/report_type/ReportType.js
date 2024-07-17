import React from 'react'
import 'cropperjs/dist/cropper.css'
import MaterialReactTable from 'material-react-table'
import { ToastContainer } from 'react-toastify'
import { api } from 'src/components/SystemConfiguration'
import { useQuery } from '@tanstack/react-query'
import PageTitle from 'src/components/PageTitle'

const ReportType = ({ cardTitle }) => {
  const column = [
    {
      accessorKey: 'type',
      header: 'Report Type',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
  ]

  const reportType = useQuery({
    queryFn: async () =>
      await api.get('report_type').then((response) => {
        console.info(response.data)
        return response.data
      }),
    queryKey: ['reportType'],
    staleTime: Infinity,
  })

  return (
    <>
      <ToastContainer />
      <PageTitle pageTitle={cardTitle} />
      <MaterialReactTable
        columns={column}
        data={!reportType.isLoading && reportType.data}
        state={{
          isLoading: reportType.isLoading,
          isSaving: reportType.isLoading,
          showLoadingOverlay: reportType.isLoading,
          showProgressBars: reportType.isLoading,
          showSkeletons: reportType.isLoading,
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
        initialState={{
          density: 'compact',
          columnPinning: { left: ['mrt-row-actions'] },
        }}
      />
    </>
  )
}

export default ReportType
