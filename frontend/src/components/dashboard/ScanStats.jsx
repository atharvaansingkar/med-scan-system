import { useEffect } from "react";
import { useDashboardStore } from "../../lib/store";
import "../../styles/scan-stats.css";
import { BarChartIcon, CalendarDaysIcon, CheckIcon } from "../icons/Icons";

export default function ScanStats() {
  const { totalScansToday, expiredItemsCount, systemAccuracy, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="scan-stats">
      <div className="stat-card">
        <div className="stat-content">
          <p className="stat-label">Total Scans Today</p>
          <div className="stat-value">
            <p className="stat-number">{totalScansToday}</p>
            <span className="stat-unit">items</span>
          </div>
          <div className="stat-icon today"><CalendarDaysIcon /></div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-content">
          <p className="stat-label">Expired Items</p>
          <div className="stat-value">
            <p className="stat-number">{expiredItemsCount}</p>
            <span className="stat-unit">detected</span>
          </div>
          <div className="stat-icon expired"><BarChartIcon /></div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-content">
          <p className="stat-label">System Accuracy</p>
          <div className="stat-value">
            <p className="stat-number">{systemAccuracy}%</p>
            <span className="stat-unit">avg</span>
          </div>
          <div className="stat-icon accuracy"><CheckIcon /></div>
        </div>
      </div>
    </div>
  );
}
