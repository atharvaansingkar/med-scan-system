import { useEffect } from "react";
import { useDashboardStore } from "../../lib/store";
import "../../styles/scan-results-table.css";

export default function ScanResultsTable() {
  const { scanResults, loadScanResults } = useDashboardStore();

  useEffect(() => {
    loadScanResults();
  }, [loadScanResults]);

  return (
    <div className="scan-results-card">
      <div className="card-content">
        <div className="table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Batch</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Scanned At</th>
              </tr>
            </thead>
            <tbody>
              {scanResults.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-table">No scans recorded yet</td>
                </tr>
              ) : (
                scanResults.map((scan) => (
                  <tr key={scan.id}>
                    <td>{scan.raw_name || 'Unknown'}</td>
                    <td>{scan.batch || 'N/A'}</td>
                    <td>{scan.exp_date ? new Date(scan.exp_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${scan.status}`}>
                        {scan.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(scan.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
