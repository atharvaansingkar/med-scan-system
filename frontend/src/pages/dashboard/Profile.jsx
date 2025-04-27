"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import "../../styles/profile.css"

// Import icons
import {
  CameraIcon,
  EyeIcon,
  EyeOffIcon,
  HistoryIcon,
  LockIcon,
  ShieldIcon,
  TrashIcon,
  UserIcon,
} from "../../components/icons/Icons"

function Profile() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("general")
  const [name, setName] = useState(user?.email?.split("@")[0] || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)

  const { toast } = useToast()

  // Session data (mock)
  const sessionData = [
    {
      id: "1",
      device: "Chrome on Windows",
      location: "New York, USA",
      ipAddress: "192.168.1.1",
      lastActive: "2 minutes ago",
      status: "current",
    },
    {
      id: "2",
      device: "Firefox on macOS",
      location: "Los Angeles, USA",
      ipAddress: "192.168.1.2",
      lastActive: "2 days ago",
      status: "active",
    },
    {
      id: "3",
      device: "Safari on iPhone",
      location: "Toronto, Canada",
      ipAddress: "192.168.1.3",
      lastActive: "1 week ago",
      status: "inactive",
    },
  ]

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would save the profile data
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "New password and confirm password do not match.",
      })
      return
    }

    // In a real app, this would update the password
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    })
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleToggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled)
    toast({
      title: is2FAEnabled ? "2FA Disabled" : "2FA Enabled",
      description: is2FAEnabled
        ? "Two-factor authentication has been disabled for your account."
        : "Two-factor authentication has been enabled for your account.",
    })
  }

  const terminateSession = (sessionId) => {
    // In a real app, this would terminate the session
    toast({
      title: "Session terminated",
      description: "The selected session has been terminated.",
    })
  }

  const deleteAccount = () => {
    // In a real app, this would show a confirmation dialog and then delete the account
    toast({
      variant: "destructive",
      title: "Account deleted",
      description: "Your account has been permanently deleted.",
    })
  }

  // Get user initials for avatar fallback
  const getInitials = (email) => {
    if (!email) return "U"
    return email.charAt(0).toUpperCase()
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-description">Manage your account settings and preferences.</p>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <UserIcon />
          <span>General</span>
        </button>
        <button
          className={`tab-button ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <ShieldIcon />
          <span>Security</span>
        </button>
        <button
          className={`tab-button ${activeTab === "sessions" ? "active" : ""}`}
          onClick={() => setActiveTab("sessions")}
        >
          <HistoryIcon />
          <span>Sessions</span>
        </button>
      </div>

      <div className="tab-content">
        {/* General Tab */}
        {activeTab === "general" && (
          <div className="general-tab">
            <div className="profile-card">
              <div className="card-header">
                <h2 className="card-title">Profile</h2>
                <p className="card-description">Update your profile information and preferences.</p>
              </div>
              <div className="card-content">
                {/* Avatar upload section */}
                <div className="avatar-section">
                  <div className="avatar">
                    <span>{getInitials(user?.email || "")}</span>
                  </div>
                  <div className="avatar-info">
                    <h3 className="avatar-title">Profile Picture</h3>
                    <p className="avatar-description">Upload a new profile picture. Recommended size: 300x300px.</p>
                    <div className="avatar-actions">
                      <button className="avatar-button">
                        <CameraIcon />
                        Upload
                      </button>
                      <button className="avatar-button">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="separator"></div>

                {/* Profile form */}
                <form onSubmit={handleProfileSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <p className="form-description">This is your public display name.</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input id="email" type="email" className="form-input" value={email} disabled />
                    <p className="form-description">Your email address cannot be changed.</p>
                  </div>

                  <button type="submit" className="profile-button">
                    Update profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="security-tab">
            {/* Password section */}
            <div className="profile-card">
              <div className="card-header">
                <h2 className="card-title">Password</h2>
                <p className="card-description">Update your password to keep your account secure.</p>
              </div>
              <div className="card-content">
                <form onSubmit={handlePasswordSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword" className="form-label">
                      Current Password
                    </label>
                    <div className="password-input-container">
                      <LockIcon className="password-icon" />
                      <input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        className="form-input with-icon"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <div className="password-input-container">
                      <LockIcon className="password-icon" />
                      <input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        className="form-input with-icon"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    <p className="form-description">Password must be at least 8 characters long.</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <div className="password-input-container">
                      <LockIcon className="password-icon" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-input with-icon"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="profile-button">
                    Update password
                  </button>
                </form>
              </div>
            </div>

            {/* 2FA section */}
            <div className="profile-card">
              <div className="card-header">
                <h2 className="card-title">Two-Factor Authentication</h2>
                <p className="card-description">Add an extra layer of security to your account.</p>
              </div>
              <div className="card-content">
                <div className="toggle-section">
                  <div className="toggle-info">
                    <p className="toggle-title">Two-Factor Authentication</p>
                    <p className="toggle-description">Protect your account with an additional verification step.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={is2FAEnabled} onChange={handleToggle2FA} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {is2FAEnabled && (
                  <div className="info-box">
                    <p className="info-text">Two-factor authentication is enabled for your account.</p>
                    <button className="info-button">Manage 2FA Settings</button>
                  </div>
                )}
              </div>
            </div>

            {/* Danger zone */}
            <div className="profile-card danger">
              <div className="card-header">
                <h2 className="card-title danger">Danger Zone</h2>
                <p className="card-description">Irreversible and destructive actions for your account.</p>
              </div>
              <div className="card-content">
                <div className="danger-box">
                  <div className="danger-info">
                    <h3 className="danger-title">Delete Account</h3>
                    <p className="danger-description">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <button className="danger-button" onClick={deleteAccount}>
                    <TrashIcon />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === "sessions" && (
          <div className="sessions-tab">
            <div className="profile-card">
              <div className="card-header">
                <h2 className="card-title">Active Sessions</h2>
                <p className="card-description">Manage devices and locations where you're currently logged in.</p>
              </div>
              <div className="card-content">
                <div className="table-container">
                  <table className="sessions-table">
                    <thead>
                      <tr>
                        <th>Device</th>
                        <th>Location</th>
                        <th>IP Address</th>
                        <th>Last Active</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessionData.map((session) => (
                        <tr key={session.id}>
                          <td className="device-column">{session.device}</td>
                          <td>{session.location}</td>
                          <td>{session.ipAddress}</td>
                          <td>{session.lastActive}</td>
                          <td>
                            <span className={`session-badge ${session.status}`}>
                              {session.status === "current"
                                ? "Current Session"
                                : session.status === "active"
                                  ? "Active"
                                  : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="session-button"
                              onClick={() => terminateSession(session.id)}
                              disabled={session.status === "current"}
                            >
                              {session.status === "current" ? "Current" : "Terminate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer">
                <p className="footer-note">Note: Terminating a session will log out that device immediately.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
