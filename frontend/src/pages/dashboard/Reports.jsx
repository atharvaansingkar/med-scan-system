"use client"

import { useState } from "react"
import { useToast } from "../../contexts/ToastContext"
import "../../styles/reports.css"

// Import icons
import { BarChartIcon, DownloadIcon, PrinterIcon } from "../../components/icons/Icons"

function Reports() {
  const [reportType, setReportType] = useState("daily")
  const [dateRange, setDateRange] = useState({
    from: new Date(2023, 3, 1), // April 1, 2023
    to: new Date(2023, 3, 7), // April 7, 2023
  })
  const [activeTab, setActiveTab] = useState("general")
  const [chartType, setChartType] = useState("bar")

  const { toast } = useToast()

  const handleExportReport = (format) => {
    // In a real app, this would generate and download a file
    toast({
      title: `Exporting ${format.toUpperCase()} report`,
      description: `Your report is being generated and will download shortly.`,
    })
  }

  const handlePrintReport = () => {
    // In a real app, this would open a print dialog
    toast({
      title: "Printing report",
      description: "Preparing document for printing...",
    })
  }

  // Render different charts based on report type and chart type
  const renderChart = () => {
    return (
      <div className="chart-placeholder">
        <div className="chart-icon">{chartType === "bar" ? <BarChartIcon /> : <LineChartIcon />}</div>
        <p>Chart visualization for {reportType} data would be displayed here</p>
        <p className="chart-note">Using {chartType === "bar" ? "Bar" : "Line"} Chart</p>
      </div>
    )
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
                <option value="daily">Daily Summary</option>
                <option value="expired">Expired Items</option>
                <option value="medicine">Medicine Distribution</option>
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
              <button className="action-button primary" onClick={() => handleExportReport("pdf")}>
                <FileTextIcon />
                Generate PDF Report
              </button>

              <button className="action-button secondary" onClick={() => handleExportReport("csv")}>
                <DownloadIcon />
                Export to CSV
              </button>

              <button className="action-button secondary" onClick={handlePrintReport}>
                <PrinterIcon />
                Print Report
              </button>
            </div>
          </div>
        </div>

        {/* Report preview */}
        <div className="report-preview-card">
          <div className="card-header">
            <div className="title-with-tabs">
              <h2 className="card-title">Report Preview</h2>
              <div className="chart-tabs">
                <button
                  className={`chart-tab ${chartType === "bar" ? "active" : ""}`}
                  onClick={() => setChartType("bar")}
                >
                  <BarChartIcon />
                  <span>Bar</span>
                </button>
                <button
                  className={`chart-tab ${chartType === "line" ? "active" : ""}`}
                  onClick={() => setChartType("line")}
                >
                  <LineChartIcon />
                  <span>Line</span>
                </button>
              </div>
            </div>
            <p className="card-description">
              {reportType === "daily" && "Daily scan summary for the selected period"}
              {reportType === "expired" && "Monthly expired items over the year"}
              {reportType === "medicine" && "Medicine distribution breakdown"}
            </p>
          </div>
          <div className="card-content">
            <div className="chart-container">{renderChart()}</div>
          </div>
          <div className="card-footer">
            <p className="footer-note">Report data shown is for demonstration purposes only.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Line chart icon component
function LineChartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
    </svg>
  )
}

// File text icon component
function FileTextIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

export default Reports
