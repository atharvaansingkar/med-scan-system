import WebcamFeed from "../../components/dashboard/WebcamFeed";
import ControlPanel from "../../components/dashboard/ControlPanel";
import ScanStats from "../../components/dashboard/ScanStats";
import ScanResultsTable from "../../components/dashboard/ScanResultsTable";
import "../../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-grid">
        <div className="dashboard-column webcam-column">
          <WebcamFeed />
        </div>
        <div className="dashboard-column data-column">
          <ScanStats />
          <ScanResultsTable />
        </div>
      </div>
      <ControlPanel />
    </div>
  );
}