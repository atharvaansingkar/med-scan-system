"use client"

import { createContext, useContext, useState } from "react"
import "../styles/toast.css"

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description, variant = "default", duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = {
      id,
      title,
      description,
      variant,
      duration,
    }

    setToasts((prevToasts) => [...prevToasts, newToast])

    // Auto dismiss
    setTimeout(() => {
      dismissToast(id)
    }, duration)

    return id
  }

  const dismissToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.variant}`}>
            <div className="toast-header">
              <h4 className="toast-title">{toast.title}</h4>
              <button className="toast-close" onClick={() => dismissToast(toast.id)}>
                ×
              </button>
            </div>
            {toast.description && <div className="toast-description">{toast.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
