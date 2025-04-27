"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import "../../styles/auth.css"

// Import icons
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "../../components/icons/Icons"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
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
      const { error } = await signIn(email, password)

      if (error) {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: error.message,
        })
        setIsLoading(false)
        return
      }

      navigate("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "An unexpected error occurred. Please try again.",
      })
      setIsLoading(false)
    }
  }

  const signInWithOAuth = async (provider) => {
    // This would be implemented with Supabase OAuth
    toast({
      title: "Coming soon",
      description: `${provider} authentication will be available soon.`,
    })
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <LockIcon />
            </div>
          </div>
          <h1 className="auth-title">MediScan</h1>
          <p className="auth-description">Enter your credentials to sign in to your account</p>
        </div>

        <div className="auth-content">
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

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-container">
                <LockIcon className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <button type="submit" className="auth-button primary" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-separator">
            <span>OR</span>
          </div>



          <div className="auth-links">
            <Link to="/forgot-password" className="auth-link">
              Forgot your password?
            </Link>
          </div>
        </div>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
