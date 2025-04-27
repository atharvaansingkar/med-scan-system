"use client"

import { useEffect, useState } from "react"
import { useToast } from "../../contexts/ToastContext"
import { supabase } from "../../lib/supabase"
import "../../styles/reports.css"

// Import icons
import { DownloadIcon, PrinterIcon } from "../../components/icons/Icons"

function Reports() {
  const [reportType, setReportType] = useState("all")
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 4, 27), // Default start date
    to: new Date(2025, 4, 28), // Default end date
  })
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  // Fetch report data from the database
  useEffect(() => {
    async function fetchReportData() {
      setLoading(true)
      const { from, to } = dateRange

      let query = supabase
        .from("scans")
        .select("raw_name, mfg_date, exp_date, status, created_at")
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString())

      if (reportType === "expired") {
        query = query.eq("status", "expired")
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching report data:", error)
        toast({
          title: "Error loading report data",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setReportData(data)
      }
      setLoading(false)
    }

    fetchReportData()
  }, [dateRange, reportType, toast])

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Medicine,MFG Date,Expiry Date,Status,Scan Date"]
        .concat(
          reportData.map(
            (item) =>
              `${item.raw_name || "Unknown"},${item.mfg_date || "N/A"},${item.exp_date || "N/A"},${item.status || "N/A"},${item.created_at || "N/A"}`
          )
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "report.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "CSV Exported",
      description: "Your report has been downloaded as a CSV.",
    })
  }

  const handlePrintReport = () => {
    const printWindow = window.open("", "_blank")
    const tableRows = reportData
      .map(
        (item) =>
          `<tr>
            <td>${item.raw_name || "Unknown"}</td>
            <td>${item.mfg_date || "N/A"}</td>
            <td>${item.exp_date || "N/A"}</td>
            <td>${item.status || "N/A"}</td>
            <td>${item.created_at || "N/A"}</td>
          </tr>`
      )
      .join("")

    printWindow.document.write(`
      <html>
        <head>
          <title>Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h1>MediScan</h1>
          <p>Report Type: ${reportType === "all" ? "All Scanned Items" : "Expired Items"}</p>
          <p>Date Range: ${dateRange.from.toDateString()} - ${dateRange.to.toDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>MFG Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Scan Date</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    if (isNaN(date)) return "Invalid Date"
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-description">Generate and export pharmaceutical scan reports.</p>
      </div>

      <div className="reports-grid">
        {/* Report settings sidebar */}
        <div className="report-settings-card">
          <div className="card-header">
            <h2 className="card-title">Report Settings</h2>
            <p className="card-description">Configure and generate reports.</p>
          </div>
          <div className="card-content">
            <div className="settings-group">
              <label className="settings-label">Report Type</label>
              <select className="settings-select" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="all">All Scanned Items</option>
                <option value="expired">Expired Items</option>
              </select>
            </div>

            <div className="settings-group">
              <label className="settings-label">Date Range</label>
              <div className="date-range-group">
                <div className="date-input-group">
                  <label>From</label>
                  <input
                    type="date"
                    value={dateRange.from ? dateRange.from.toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value ? new Date(e.target.value) : null })
                    }
                    className="date-input"
                  />
                </div>
                <div className="date-input-group">
                  <label>To</label>
                  <input
                    type="date"
                    value={dateRange.to ? dateRange.to.toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value ? new Date(e.target.value) : null })
                    }
                    className="date-input"
                  />
                </div>
              </div>
            </div>

            <div className="actions-group">
              <button className="action-button secondary" onClick={handleExportCSV}>
                <DownloadIcon />
                Export CSV
              </button>
              <button className="action-button secondary" onClick={handlePrintReport}>
                <PrinterIcon />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Report preview */}
        <div className="report-preview-card">
          <div className="card-header">
            <h2 className="card-title">Report Preview</h2>
            <p className="card-description">
              {reportType === "all" && "All scanned items for the selected period"}
              {reportType === "expired" && "Expired items for the selected period"}
            </p>
          </div>
          <div className="card-content">
            {loading ? (
              <p>Loading report data...</p>
            ) : reportData.length === 0 ? (
              <p>No data available for the selected date range.</p>
            ) : (
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>MFG Date</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Scan Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item) => (
                    <tr key={item.created_at}>
                      <td>{item.raw_name || "Unknown"}</td>
                      <td>{formatDate(item.mfg_date)}</td>
                      <td>{formatDate(item.exp_date)}</td>
                      <td>{item.status || "N/A"}</td>
                      <td>{formatDate(item.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
