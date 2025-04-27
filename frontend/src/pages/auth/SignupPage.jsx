"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import "../../styles/auth.css"

// Import icons
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "../../components/icons/Icons"

function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { signUp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) return 0

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 20

    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 20 // Uppercase
    if (/[a-z]/.test(password)) strength += 20 // Lowercase
    if (/[0-9]/.test(password)) strength += 20 // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 20 // Special chars

    return strength
  }

  const validateForm = () => {
    const newErrors = {}

    if (!name) {
      newErrors.name = "Name is required"
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter"
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter"
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number"
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordStrength(calculatePasswordStrength(newPassword))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signUp(email, password)

      if (error) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: error.message,
        })
        setIsLoading(false)
        return
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      })

      navigate("/login") // Redirect to login page
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <UserIcon />
            </div>
          </div>
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-description">Enter your information to create a MediScan account</p>
        </div>

        <div className="auth-content">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="input-container">
                <UserIcon className="input-icon" />
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

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
                  placeholder="Create a password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-progress"
                    style={{ width: `${passwordStrength}%`, backgroundColor: getStrengthColor(passwordStrength) }}
                  ></div>
                </div>
                <div className="strength-labels">
                  <span>Weak</span>
                  <span>Strong</span>
                </div>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="input-container">
                <LockIcon className="input-icon" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Confirm your password"
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
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>

            <div className="form-group terms-container">
              <div className="checkbox-container">
                <input
                  id="terms"
                  type="checkbox"
                  className="form-checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label htmlFor="terms" className="checkbox-label">
                  I agree to the{" "}
                  <Link to="/terms" className="auth-link">
                    terms of service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="auth-link">
                    privacy policy
                  </Link>
                </label>
              </div>
              {errors.terms && <p className="form-error">{errors.terms}</p>}
            </div>

            <button type="submit" className="auth-button primary" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function getStrengthColor(strength) {
  if (strength < 30) return "#ff4d4f" // Red
  if (strength < 60) return "#faad14" // Yellow
  return "#52c41a" // Green
}

export default SignupPage
