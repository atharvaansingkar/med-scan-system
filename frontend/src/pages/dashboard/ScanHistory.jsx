"use client"

import { useState } from "react"
import { useToast } from "../../contexts/ToastContext"
import "../../styles/scan-history.css"

// Import icons
import { FilterIcon, SearchIcon, XIcon } from "../../components/icons/Icons"

function ScanHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  })
  const [statusFilter, setStatusFilter] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState([])

  const { toast } = useToast()

  // Sample data for demonstration (in a real app, this would come from an API)
  const sampleData = generateSampleData()

  // Items per page
  const ITEMS_PER_PAGE = 10

  // Apply filters to data
  const filteredData = sampleData.filter((item) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batch.toLowerCase().includes(searchTerm.toLowerCase())

    // Date range filter
    const matchesDateRange =
      (!dateRange.from || new Date(item.createdAt) >= dateRange.from) &&
      (!dateRange.to || new Date(item.createdAt) <= new Date(dateRange.to?.getTime() + 86400000)) // Include the end date

    // Status filter
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(item.status)

    return matchesSearch && matchesDateRange && matchesStatus
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Check if an item is selected
  const isSelected = (id) => selectedItems.includes(id)

  // Toggle item selection
  const toggleItemSelection = (id) => {
    if (isSelected(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // Toggle all items on the current page
  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(paginatedData.map((item) => item.id))
    }
  }

  // Toggle status filter
  const toggleStatusFilter = (status) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status))
    } else {
      setStatusFilter([...statusFilter, status])
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setDateRange({ from: null, to: null })
    setStatusFilter([])
    setCurrentPage(1)
  }

  // Export selected items
  const exportSelected = (format) => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to export.",
      })
      return
    }

    toast({
      title: `Exporting ${selectedItems.length} items as ${format.toUpperCase()}`,
      description: "Your export is being prepared and will download shortly.",
    })
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
            <p className="history-description">Complete history of all pharmaceutical scans</p>
          </div>

          <div className="search-filter-controls">
            {/* Search */}
            <div className="search-container">
              <SearchIcon className="search-icon" />
              <input
                type="search"
                placeholder="Search medicines or batches..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search-button" onClick={() => setSearchTerm("")}>
                  <XIcon />
                  <span className="sr-only">Clear search</span>
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="filter-container">
              <button
                className="filter-button"
                onClick={() => document.getElementById("filter-dropdown").classList.toggle("show")}
              >
                <FilterIcon />
                <span>Filter</span>
                {(dateRange.from || statusFilter.length > 0) && (
                  <span className="filter-badge">{(dateRange.from ? 1 : 0) + (statusFilter.length > 0 ? 1 : 0)}</span>
                )}
              </button>

              <div id="filter-dropdown" className="filter-dropdown">
                <div className="filter-section">
                  <h4 className="filter-section-title">Filter Options</h4>

                  <div className="filter-group">
                    <label className="filter-label">Status</label>
                    <div className="checkbox-group">
                      <div className="checkbox-item">
                        <input
                          id="status-valid"
                          type="checkbox"
                          checked={statusFilter.includes("valid")}
                          onChange={() => toggleStatusFilter("valid")}
                        />
                        <label htmlFor="status-valid">Valid</label>
                      </div>
                      <div className="checkbox-item">
                        <input
                          id="status-expired"
                          type="checkbox"
                          checked={statusFilter.includes("expired")}
                          onChange={() => toggleStatusFilter("expired")}
                        />
                        <label htmlFor="status-expired">Expired</label>
                      </div>
                    </div>
                  </div>

                  <div className="filter-separator"></div>

                  <div className="filter-group">
                    <label className="filter-label">Date Range</label>
                    <div className="date-picker-group">
                      <div className="date-picker-item">
                        <label>From</label>
                        <input
                          type="date"
                          value={dateRange.from ? dateRange.from.toISOString().split("T")[0] : ""}
                          onChange={(e) =>
                            setDateRange({ ...dateRange, from: e.target.value ? new Date(e.target.value) : null })
                          }
                        />
                      </div>
                      <div className="date-picker-item">
                        <label>To</label>
                        <input
                          type="date"
                          value={dateRange.to ? dateRange.to.toISOString().split("T")[0] : ""}
                          onChange={(e) =>
                            setDateRange({ ...dateRange, to: e.target.value ? new Date(e.target.value) : null })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="filter-actions">
                    <button className="filter-button clear" onClick={clearFilters}>
                      Clear Filters
                    </button>
                    <button
                      className="filter-button apply"
                      onClick={() => document.getElementById("filter-dropdown").classList.remove("show")}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="history-content">
          <div className="table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={paginatedData.length > 0 && selectedItems.length === paginatedData.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Medicine</th>
                  <th>Batch</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Scan Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-table">
                      No results found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id} className={isSelected(item.id) ? "selected" : ""}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                        />
                      </td>
                      <td className="medicine-name">{item.name}</td>
                      <td>{item.batch}</td>
                      <td>{formatDate(item.expiry)}</td>
                      <td>
                        <span className={`status-badge ${item.status}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-button">View</button>
                          <button className="action-button">Export</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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

          {selectedItems.length > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">{selectedItems.length} items selected</span>
              <div className="bulk-action-buttons">
                <button className="bulk-action-button" onClick={() => exportSelected("csv")}>
                  Export as CSV
                </button>
                <button className="bulk-action-button" onClick={() => exportSelected("pdf")}>
                  Export as PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to generate sample data
function generateSampleData() {
  const medications = [
    "Amoxicillin 500mg",
    "Lisinopril 10mg",
    "Metformin 850mg",
    "Atorvastatin 20mg",
    "Levothyroxine 50mcg",
    "Omeprazole 20mg",
    "Simvastatin 40mg",
    "Amlodipine 5mg",
    "Ibuprofen 400mg",
    "Paracetamol 500mg",
  ]

  const batches = [
    "AMX2023-001",
    "LIS2022-145",
    "MET2023-078",
    "ATV2022-221",
    "LEV2023-089",
    "OMP2022-332",
    "SIM2022-316",
    "AML2023-112",
    "IBU2022-199",
    "PAR2023-045",
  ]

  const results = []

  for (let i = 0; i < 50; i++) {
    const medicationIndex = Math.floor(Math.random() * medications.length)
    const batchIndex = Math.floor(Math.random() * batches.length)
    const daysAgo = Math.floor(Math.random() * 30) // Random day in the last month
    const expiryMonths = Math.floor(Math.random() * 24) - 3 // Random expiry (-3 to +21 months)
    const isExpired = expiryMonths <= 0

    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    const expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() + expiryMonths)

    results.push({
      id: `scan-${i + 1}`,
      name: medications[medicationIndex],
      batch: batches[batchIndex],
      expiry: expiryDate,
      status: isExpired ? "expired" : "valid",
      imageUrl: null,
      createdAt: date,
    })
  }

  // Sort by creation date (newest first)
  return results.sort((a, b) => b.createdAt - a.createdAt)
}

export default ScanHistory
