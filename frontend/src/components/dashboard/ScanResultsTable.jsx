"use client"

import { useEffect, useState } from "react"
import { useToast } from "../../contexts/ToastContext"
import { supabase } from "../../lib/supabase"
import "../../styles/scan-history.css"

function ScanHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [currentPage, setCurrentPage] = useState(1)
  const [scanResults, setScanResults] = useState([])

  const { toast } = useToast()
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    async function fetchScans() {
      const { data, error } = await supabase
        .from("scans")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching scans:", error)
        toast({
          title: "Error loading scans",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setScanResults(data)
      }
    }

    fetchScans()
  }, [])

  const filteredData = scanResults.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      (item.raw_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    const matchesDateRange =
      (!dateRange.from || new Date(item.created_at) >= dateRange.from) &&
      (!dateRange.to || new Date(item.created_at) <= new Date(dateRange.to?.getTime() + 86400000))

    return matchesSearch && matchesDateRange
  })

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

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

  const clearFilters = () => {
    setSearchTerm("")
    setDateRange({ from: null, to: null })
    setCurrentPage(1)
  }

  return (
    <div className="scan-history-page">
      <div className="page-header">
        <h1 className="page-title">Scan History</h1>
        <p className="page-description">View and manage your pharmaceutical scan history.</p>
      </div>

      <div className="history-card">
        <div className="history-header">
          <div className="header-content">
            <h2 className="history-title">Scan Results</h2>
            <p className="history-description">Complete history of scanned medicines.</p>
          </div>

          <div className="search-filter-controls">
            {/* Search */}
            <div className="search-container">
              <input
                type="search"
                placeholder="Search medicines..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search-button" onClick={clearFilters}>
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="history-content">
          <div className="table-container">
            <table className="history-table">
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
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-table">
                      No results found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id}>
                      <td className="medicine-name">{item.raw_name || "Unknown"}</td>
                      <td>{formatDate(item.mfg_date)}</td>
                      <td>{formatDate(item.exp_date)}</td>
                      <td>{item.status || "N/A"}</td>
                      <td>{formatDate(item.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScanHistory
