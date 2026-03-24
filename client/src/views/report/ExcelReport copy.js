import React from 'react'
import * as XLSX from 'xlsx'

const DataTable = ({ data }) => {
  // Define your custom header with a colspan of 12
  const headerRow1 = ['Header 1']
  const headerRow2 = [
    'Seq. No.',
    'CONTROL No.',
    'DATE',
    'PLATE Number',
    'TYPE OF VEHICLE',
    'DRIVER',
    'OFFICE',
    'PURPOSE',
    'PRODUCT TYPE',
    'FUEL PRICE',
    'QUANTITY (LITERS)',
    'GROSS AMOUNT',
  ]

  const exportToExcel = () => {
    // Prepare the data for the Excel file
    const wsData = [
      // First header row with a merged cell spanning 12 columns
      [
        {
          v: 'Header 1',
          s: { font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } },
        },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],

      // Second header row
      [
        'Seq. No.',
        'CONTROL No.',
        'DATE',
        'PLATE Number',
        'TYPE OF VEHICLE',
        'DRIVER',
        'OFFICE',
        'PURPOSE',
        'PRODUCT TYPE',
        'FUEL PRICE',
        'QUANTITY (LITERS)',
        'GROSS AMOUNT',
      ],
      // Data rows (populate dynamically as needed)
      // ...data.map((row) => [
      //   row.field1,
      //   row.field2,
      //   row.field3,
      //   row.field4,
      //   row.field5,
      //   row.field6,
      //   row.field7,
      //   row.field8,
      //   row.field9,
      //   row.field10,
      //   row.field11,
      //   row.field12,
      // ]),
    ]

    // Create worksheet from data
    const worksheet = XLSX.utils.aoa_to_sheet(wsData)

    // Define merge ranges
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }, // Merge Header 1 across 12 columns
    ]

    // Create workbook and append the worksheet
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // Generate the Excel file and trigger download
    XLSX.writeFile(workbook, 'report.xlsx')
  }

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead>
          <tr>
            <th colSpan="12" style={{ textAlign: 'center', fontWeight: 'bold' }}>
              {headerRow1[0]}
            </th>
          </tr>
          <tr>
            {headerRow2.map((header, index) => (
              <th key={index} style={{ border: '1px solid black' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row.field1}</td>
              <td>{row.field2}</td>
              <td>{row.field3}</td>
              <td>{row.field4}</td>
              <td>{row.field5}</td>
              <td>{row.field6}</td>
              <td>{row.field7}</td>
              <td>{row.field8}</td>
              <td>{row.field9}</td>
              <td>{row.field10}</td>
              <td>{row.field11}</td>
              <td>{row.field12}</td>
            </tr>
          ))} */}
        </tbody>
      </table>
      <button onClick={exportToExcel}>Export to Excel</button>
    </div>
  )
}

export default DataTable
