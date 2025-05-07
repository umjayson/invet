"use client"

import { useState } from "react"
import { useAuth } from "../auth-context"
import Link from "next/link"

export default function EmployeeRegistration() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [teamPin, setTeamPin] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Add password strength meter and better validation
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  })

  // Add password visibility toggles
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Add terms acceptance checkbox
  const [termsAccepted, setTermsAccepted] = useState(false)

  const { createEmployeeAccount } = useAuth()

  // Add password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) {
      return { score: 0, label: "", color: "" }
    }

    let score = 0

    // Length check
    if (password.length >= 8) score++
    if (password.length >= 12) score++

    // Complexity checks
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    // Cap at 4
    score = Math.min(score, 4)

    const strengthMap = {
      0: { label: "Too weak", color: "bg-red-500" },
      1: { label: "Weak", color: "bg-red-500" },
      2: { label: "Medium", color: "bg-yellow-500" },
      3: { label: "Strong", color: "bg-green-500" },
      4: { label: "Very strong", color: "bg-green-500" },
    }

    return {
      score,
      label: strengthMap[score].label,
      color: strengthMap[score].color,
    }
  }

  // Update password input handler to check strength
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordStrength(checkPasswordStrength(newPassword))
  }

  // Add better form validation
  const validateForm = () => {
    // Reset error
    setError("")

    // Validate name
    if (!name.trim()) {
      setError("Full name is required")
      return false
    }

    // Validate email
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }

    // Validate team PIN
    if (!teamPin) {
      setError("Team PIN is required")
      return false
    }

    if (teamPin.length !== 6 || !/^\d+$/.test(teamPin)) {
      setError("Team PIN should be a 6-digit number")
      return false
    }

    // Validate password
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    // Validate terms acceptance
    if (!termsAccepted) {
      setError("You must accept the terms and conditions")
      return false
    }

    return true
  }

  // Update handleSubmit to use the validation
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      await createEmployeeAccount(email, password, name, teamPin)
      setSuccess(true)
    } catch (error) {
      if (error.message.includes("Invalid team PIN")) {
        setError("Invalid team PIN. Please check with your team administrator.")
      } else if (error.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please use a different email or try to log in.")
      } else {
        setError(error.message || "Failed to create employee account")
      }
      console.error(error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 text-center border-b border-white/10">
            <div className="logo-container mx-auto mb-4">
              <div className="logo-wrapper mx-auto">
                <div className="logo-inner">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="logo-icon"
                    width="28"
                    height="28"
                  >
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Employee Registration</h1>
            <p className="text-purple-200 mt-2">Join your team on InvetChat</p>
          </div>

          {/* Registration Form */}
          <div className="p-6">
            {error && (
              <div className="bg-red-500/20 text-white border border-red-500/30 rounded-md p-3 mb-4">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {success ? (
              <div className="bg-green-500/20 text-white border border-green-500/30 rounded-md p-4 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-4 text-green-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
                <p className="mb-4">Your account has been created and you've been added to your team.</p>
                <Link
                  href="/chat"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Go to Chat
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                  <label htmlFor="name" className="form-label text-white">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      className="form-input pl-10"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      className="form-input pl-10"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="teamPin" className="form-label text-white">
                    Team PIN
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="teamPin"
                      className="form-input pl-10"
                      placeholder="Enter team PIN provided by your team admin"
                      value={teamPin}
                      onChange={(e) => setTeamPin(e.target.value)}
                      required
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                    </svg>
                  </div>
                  <p className="text-xs text-purple-300 mt-1">Ask your team administrator for the team PIN</p>
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="form-input pl-10"
                      placeholder="••••••••"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="mt-1">
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      {passwordStrength.score > 0 && (
                        <div
                          className={`h-full ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.score * 25}%` }}
                        ></div>
                      )}
                    </div>
                    {passwordStrength.label && (
                      <p className="text-xs mt-1 text-purple-300">
                        Password strength: <span className="font-medium">{passwordStrength.label}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label text-white">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className="form-input pl-10"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group mt-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-purple-200">
                        I agree to the{" "}
                        <a href="#" className="text-purple-400 hover:text-white">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-purple-400 hover:text-white">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <button type="submit" className="auth-button w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Join Team
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-purple-300 hover:text-white inline-flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
