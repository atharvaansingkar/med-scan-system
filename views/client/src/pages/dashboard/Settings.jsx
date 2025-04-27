"use client"

import { useState } from "react"
import { useToast } from "../../contexts/ToastContext"
import "../../styles/settings.css"

// Import icons
import {
  InfoIcon as BaseInfoIcon,
  SaveIcon,
  SliderIcon as BaseSliderIcon,
  BellIcon,
  VolumeIcon as BaseVolumeIcon,
} from "../../components/icons/Icons"

function Settings() {
  const [activeTab, setActiveTab] = useState("general")
  const [scanDuration, setScanDuration] = useState(5)
  const [scanQuality, setScanQuality] = useState("medium")
  const [alertVolume, setAlertVolume] = useState(75)
  const [formChanges, setFormChanges] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [desktopNotifications, setDesktopNotifications] = useState(true)
  const [soundAlerts, setSoundAlerts] = useState(false)

  const { toast } = useToast()

  const handleSaveSettings = () => {
    // In a real app, this would save the settings to the server
    toast({
      title: "Settings saved",
      description: "Your system settings have been updated successfully.",
    })
    setFormChanges(false)
  }

  // Track form changes
  const updateFormChanges = () => {
    setFormChanges(true)
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">System Settings</h1>
        <p className="page-description">Configure system settings and preferences.</p>
      </div>

      <div className="settings-tabs">
        <button
          className={`tab-button ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <BaseSliderIcon />
          <span>General</span>
        </button>
        <button
          className={`tab-button ${activeTab === "notifications" ? "active" : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          <BellIcon />
          <span>Notifications</span>
        </button>
        <button className={`tab-button ${activeTab === "audio" ? "active" : ""}`} onClick={() => setActiveTab("audio")}>
          <BaseVolumeIcon />
          <span>Audio</span>
        </button>
      </div>

      <div className="tab-content">
        {/* General Settings Tab */}
        {activeTab === "general" && (
          <div className="settings-card">
            <div className="card-header">
              <h2 className="card-title">General Settings</h2>
              <p className="card-description">Configure general system settings.</p>
            </div>
            <div className="card-content">
              <div className="settings-form">
                <div className="form-group">
                  <label htmlFor="api-endpoint" className="form-label">
                    API Endpoint
                  </label>
                  <input
                    id="api-endpoint"
                    type="text"
                    className="form-input"
                    defaultValue="http://flask-service/api"
                    onChange={updateFormChanges}
                  />
                  <p className="form-description">The base URL for the scanning service API.</p>
                </div>

                <div className="form-group">
                  <label htmlFor="stream-url" className="form-label">
                    Webcam Stream URL
                  </label>
                  <input
                    id="stream-url"
                    type="text"
                    className="form-input"
                    defaultValue="http://flask-service/stream"
                    onChange={updateFormChanges}
                  />
                  <p className="form-description">The URL for the webcam MJPEG stream.</p>
                </div>

                <div className="separator"></div>

                <div className="form-group">
                  <label htmlFor="scan-duration" className="form-label">
                    Scan Duration (seconds)
                  </label>
                  <div className="slider-container">
                    <input
                      id="scan-duration"
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={scanDuration}
                      onChange={(e) => {
                        setScanDuration(Number.parseInt(e.target.value))
                        updateFormChanges()
                      }}
                      className="slider"
                    />
                    <span className="slider-value">{scanDuration}s</span>
                  </div>
                  <p className="form-description">Duration of each scan operation.</p>
                </div>

                <div className="form-group">
                  <label htmlFor="scan-quality" className="form-label">
                    Scan Quality
                  </label>
                  <select
                    id="scan-quality"
                    className="form-select"
                    value={scanQuality}
                    onChange={(e) => {
                      setScanQuality(e.target.value)
                      updateFormChanges()
                    }}
                  >
                    <option value="low">Low (Faster)</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (More Accurate)</option>
                  </select>
                  <p className="form-description">Higher quality provides more accurate results but takes longer.</p>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <label htmlFor="auto-start" className="toggle-label">
                      Auto-Start Scan
                    </label>
                    <p className="toggle-description">Automatically start scanning when system initializes.</p>
                  </div>
                  <label className="toggle-switch">
                    <input id="auto-start" type="checkbox" defaultChecked={false} onChange={updateFormChanges} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <label htmlFor="debug-mode" className="toggle-label">
                      Debug Mode
                    </label>
                    <p className="toggle-description">Enable detailed logging for troubleshooting.</p>
                  </div>
                  <label className="toggle-switch">
                    <input id="debug-mode" type="checkbox" defaultChecked={false} onChange={updateFormChanges} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="settings-button secondary">Reset to Defaults</button>
              <button className="settings-button primary" onClick={handleSaveSettings} disabled={!formChanges}>
                <SaveIcon />
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="settings-card">
            <div className="card-header">
              <h2 className="card-title">Notification Settings</h2>
              <p className="card-description">Configure how you receive notifications.</p>
            </div>
            <div className="card-content">
              <div className="settings-form">
                <div className="toggle-group">
                  <div className="toggle-info">
                    <label htmlFor="email-notifications" className="toggle-label">
                      Email Notifications
                    </label>
                    <p className="toggle-description">Receive scan results and alerts via email.</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      id="email-notifications"
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => {
                        setEmailNotifications(e.target.checked)
                        updateFormChanges()
                      }}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {emailNotifications && (
                  <div className="nested-settings">
                    <div className="form-group">
                      <label htmlFor="email-address" className="form-label">
                        Email Address
                      </label>
                      <input
                        id="email-address"
                        type="email"
                        className="form-input"
                        placeholder="Your email address"
                        onChange={updateFormChanges}
                      />
                    </div>

                    <div className="toggle-group">
                      <label htmlFor="daily-summary" className="toggle-label">
                        Daily Summary
                      </label>
                      <label className="toggle-switch">
                        <input id="daily-summary" type="checkbox" defaultChecked={true} onChange={updateFormChanges} />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-group">
                      <label htmlFor="expired-alerts" className="toggle-label">
                        Expired Item Alerts
                      </label>
                      <label className="toggle-switch">
                        <input id="expired-alerts" type="checkbox" defaultChecked={true} onChange={updateFormChanges} />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="separator"></div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <label htmlFor="desktop-notifications" className="toggle-label">
                      Desktop Notifications
                    </label>
                    <p className="toggle-description">Show notifications in your browser or desktop.</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      id="desktop-notifications"
                      type="checkbox"
                      checked={desktopNotifications}
                      onChange={(e) => {
                        setDesktopNotifications(e.target.checked)
                        updateFormChanges()
                      }}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <label htmlFor="sound-alerts" className="toggle-label">
                      Sound Alerts
                    </label>
                    <p className="toggle-description">Play a sound when an expired item is detected.</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      id="sound-alerts"
                      type="checkbox"
                      checked={soundAlerts}
                      onChange={(e) => {
                        setSoundAlerts(e.target.checked)
                        updateFormChanges()
                      }}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="settings-button secondary">Reset to Defaults</button>
              <button className="settings-button primary" onClick={handleSaveSettings} disabled={!formChanges}>
                <SaveIcon />
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Audio Tab */}
        {activeTab === "audio" && (
          <div className="settings-card">
            <div className="card-header">
              <h2 className="card-title">Audio Settings</h2>
              <p className="card-description">Configure audio alerts and volume levels.</p>
            </div>
            <div className="card-content">
              <div className="settings-form">
                <div className="form-group">
                  <div className="slider-header">
                    <label htmlFor="alert-volume" className="form-label">
                      Alert Volume
                    </label>
                    <span className="volume-level">{alertVolume}%</span>
                  </div>
                  <input
                    id="alert-volume"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={alertVolume}
                    onChange={(e) => {
                      setAlertVolume(Number.parseInt(e.target.value))
                      updateFormChanges()
                    }}
                    className="slider"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="alert-sound" className="form-label">
                    Alert Sound
                  </label>
                  <select id="alert-sound" className="form-select" defaultValue="beep" onChange={updateFormChanges}>
                    <option value="beep">Beep</option>
                    <option value="chime">Chime</option>
                    <option value="alert">Alert</option>
                    <option value="siren">Siren</option>
                  </select>
                  <p className="form-description">Sound to play when alerts are triggered.</p>
                </div>

                <div className="info-box">
                  <BaseInfoIcon />
                  <p className="info-text">Test your selected alert sound by clicking the button below.</p>
                </div>

                <button
                  className="test-sound-button"
                  onClick={() => {
                    toast({
                      title: "Alert sound played",
                      description: "You should hear the selected alert sound.",
                    })
                  }}
                >
                  <BaseVolumeIcon />
                  Test Alert Sound
                </button>

                <div className="separator"></div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <label htmlFor="system-sounds" className="toggle-label">
                      System Sounds
                    </label>
                    <p className="toggle-description">Play sounds for system events and interactions.</p>
                  </div>
                  <label className="toggle-switch">
                    <input id="system-sounds" type="checkbox" defaultChecked={true} onChange={updateFormChanges} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <label htmlFor="scan-complete-sound" className="toggle-label">
                      Scan Complete Sound
                    </label>
                    <p className="toggle-description">Play a sound when a scan operation completes.</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      id="scan-complete-sound"
                      type="checkbox"
                      defaultChecked={true}
                      onChange={updateFormChanges}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="settings-button secondary">Reset to Defaults</button>
              <button className="settings-button primary" onClick={handleSaveSettings} disabled={!formChanges}>
                <SaveIcon />
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
