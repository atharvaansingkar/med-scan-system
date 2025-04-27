"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useTheme } from "../../contexts/ThemeContext"
import "../../styles/dashboard-nav.css"

// Import icons (using a simple approach for this example)
import {
  BellIcon,
  ChevronDownIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "../icons/Icons"

function DashboardNav() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Get user initials for avatar fallback
  const getInitials = (email) => {
    if (!email) return "U"
    return email.charAt(0).toUpperCase()
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Scan History", href: "/dashboard/history" },
    { name: "Reports", href: "/dashboard/reports" },
  ]

  return (
    <header className="dashboard-nav">
      <div className="dashboard-nav-container">
        <div className="dashboard-nav-logo">
          <Link to="/dashboard" className="logo-link">
            <div className="logo-icon">
              <span>M</span>
            </div>
            <span className="logo-text">MediScan</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button className="mobile-menu-trigger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <MenuIcon />
          <span className="sr-only">Toggle menu</span>
        </button>

        {/* Mobile menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-header">
            <Link to="/dashboard" className="logo-link">
              <div className="logo-icon">
                <span>M</span>
              </div>
              <span className="logo-text">MediScan</span>
            </Link>
            <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
              ×
            </button>
          </div>
          <nav className="mobile-menu-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`mobile-menu-link ${location.pathname === item.href ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop navigation */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`nav-link ${location.pathname === item.href ? "active" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          {/* Theme toggle */}
          <button className="theme-toggle" aria-label="Toggle theme" onClick={toggleTheme}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Notifications */}
         

          {/* User menu */}
          <div className="user-menu-container">
            <button className="user-menu-button" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <div className="user-avatar">{getInitials(user?.email || "")}</div>
              <span className="user-name">{user?.email?.split("@")[0]}</span>
              <ChevronDownIcon />
            </button>

            {userMenuOpen && (
              <div className="user-menu">
                <Link to="/dashboard/profile" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                  <UserIcon />
                  <span>My Profile</span>
                </Link>
                <div className="user-menu-separator"></div>
                <button
                  className="user-menu-item"
                  onClick={() => {
                    signOut()
                    setUserMenuOpen(false)
                  }}
                >
                  <LogOutIcon />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardNav
