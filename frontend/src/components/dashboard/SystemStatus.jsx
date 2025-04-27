"use client"

import { useState } from "react" // Add this import
import { ServerIcon, ActivityIcon } from "../icons/Icons"
import { useDashboardStore } from "../../lib/store"
import { useToast } from "../../contexts/ToastContext"
import "../../styles/system-status.css"


function SystemStatus() {
  const { systemStatus, setSystemStatus } = useDashboardStore()
  const { toast } = useToast()
  const [uptime] = useState(() => {
    const start = Date.now()
    return () => Math.floor((Date.now() - start) / 1000)
  })

  const toggleSystemStatus = () => {
    const newStatus = systemStatus === "online" ? "offline" : "online"
    setSystemStatus(newStatus)
    toast({ title: `System ${newStatus}`, description: `System is now ${newStatus}` })
  }

  return (
    <div className="system-status-card">
      <div className="card-header">
        <div className="header-title">
          <ServerIcon />
          <h2>System Status</h2>
        </div>
        <p className="header-description">Real-time system diagnostics</p>
      </div>
      
      <div className="card-content">
        <div className="status-grid">
          <div className="status-group">
            <p className="status-label">Status</p>
            <div className="status-value">
              <div className={`status-indicator ${systemStatus}`}></div>
              <span className="status-text">{systemStatus}</span>
            </div>
          </div>

          <div className="status-group">
            <p className="status-label">Uptime</p>
            <p className="status-value">{Math.floor(uptime() / 3600)}h {(uptime() % 3600) / 60}m</p>
          </div>
        </div>

        <div className="status-actions">
          <button
            className={`status-button ${systemStatus === 'online' ? 'danger' : 'primary'}`}
            onClick={toggleSystemStatus}
          >
            {systemStatus === 'online' ? 'Shutdown System' : 'Activate System'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus