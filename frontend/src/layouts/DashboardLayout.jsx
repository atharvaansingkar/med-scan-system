import { Outlet } from "react-router-dom"
import DashboardNav from "../components/dashboard/DashboardNav"
import "../styles/dashboard-layout.css"

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <DashboardNav />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
