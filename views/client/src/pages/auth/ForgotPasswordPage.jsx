"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import "../../styles/auth.css"

// Import icons
import { MailIcon } from "../../components/icons/Icons"

function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [errors, setErrors] = useState({})

  const { resetPassword } = useAuth()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await resetPassword(email)

      if (error) {
        toast({
          variant: "destructive",
          title: "Reset password failed",
          description: error.message,
        })
        setIsLoading(false)
        return
      }

      setEmailSent(true)
      toast({
        title: "Reset link sent",
        description: "A password reset link has been sent to your email.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Reset password failed",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Reset your password</h1>
          <p className="auth-description">
            {emailSent
              ? "Check your email for a password reset link"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        <div className="auth-content">
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="input-container">
                  <MailIcon className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <button type="submit" className="auth-button primary" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="email-sent-message">
              <div className="email-sent-icon">
                <MailIcon />
              </div>
              <p className="email-sent-text">
                We've sent a password reset link to your email address. Please check your inbox and follow the
                instructions to reset your password.
              </p>
              <button className="auth-button outline" onClick={() => setEmailSent(false)}>
                Send Again
              </button>
            </div>
          )}
        </div>

        <div className="auth-footer">
          <p className="auth-footer-text">
            <Link to="/login" className="auth-link">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
