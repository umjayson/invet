"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { motion } from "framer-motion"
import AuthLayout from "./auth-layout"
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react'

export default function ResetPassword() {
  const router = useRouter()
  const { token } = router.query
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState({
    password: "",
    confirmPassword: ""
  })
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    // Validate token exists
    if (router.isReady && !token) {
      setError("Invalid or expired password reset link. Please request a new one.")
    }
  }, [router.isReady, token])

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }
    
    let strength = 0
    
    // Length check
    if (password.length >= 8) strength += 1
    
    // Contains number
    if (/\d/.test(password)) strength += 1
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1
    
    // Contains special char
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    
    setPasswordStrength(strength)
  }, [password])

  // Form validation
  const validateForm = () => {
    let valid = true
    const newErrors = { password: "", confirmPassword: "" }
    
    // Password validation
    if (!password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      valid = false
    } else if (passwordStrength < 3) {
      newErrors.password = "Password is too weak"
      valid = false
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      valid = false
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }
    
    setFormErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    // Validate form
    if (!validateForm()) return
    
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes, we'll just show success
      setSuccess(true)
    } catch (error) {
      setError("Failed to reset password. Please try again.")
      console.error(error)
    }

    setLoading(false)
  }

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-300/30"
    if (passwordStrength === 1) return "bg-red-500"
    if (passwordStrength === 2) return "bg-orange-500"
    if (passwordStrength === 3) return "bg-yellow-500"
    if (passwordStrength === 4) return "bg-green-500"
    return "bg-emerald-500"
  }

  const getStrengthText = () => {
    if (!password) return "Enter a password"
    if (passwordStrength === 1) return "Very weak - Use at least 8 characters"
    if (passwordStrength === 2) return "Weak - Add numbers and uppercase letters"
    if (passwordStrength === 3) return "Medium - Add special characters"
    if (passwordStrength === 4) return "Strong password"
    if (passwordStrength === 5) return "Excellent password"
    return ""
  }

  return (
    <AuthLayout 
      title="Reset Your Password"
      subtitle="Create a new secure password for your account"
    >
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 text-white border border-red-500/30 rounded-md p-3 mb-4"
        >
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </motion.div>
      )}

      {success ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6"
        >
          <div className="bg-green-500/20 text-white border border-green-500/30 rounded-md p-4 mb-6">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
            <h3 className="text-xl font-bold mb-2">Password Reset Complete</h3>
            <p className="mb-0">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
          </div>
          
          <Link
            href="/auth/login"
            className="py-2 px-4 bg-purple-700 hover:bg-purple-600 text-white rounded-md text-sm font-medium transition-colors inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="password" className="form-label text-white">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`form-input pl-10 pr-10 ${formErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (formErrors.password) {
                    setFormErrors({...formErrors, password: ""})
                  }
                }}
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300" />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {/* Password strength meter */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div 
                      key={level}
                      className={`h-1 flex-1 rounded-full ${level <= passwordStrength ? getStrengthColor() : 'bg-gray-300/30'}`}
                    ></div>
                  ))}
                </div>
                <p className={`text-xs ${passwordStrength >= 4 ? 'text-green-400' : 'text-purple-300'}`}>
                  {passwordStrength === 5 && (
                    <CheckCircle className="h-3 w-3 mr-1 inline" />
                  )}
                  {getStrengthText()}
                </p>
              </div>
            )}
            
            {formErrors.password && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-400 text-xs mt-1"
              >
                {formErrors.password}
              </motion.p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label text-white">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`form-input pl-10 pr-10 ${formErrors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (formErrors.confirmPassword) {
                    setFormErrors({...formErrors, confirmPassword: ""})
                  }
                }}
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300" />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-400 text-xs mt-1"
              >
                {formErrors.confirmPassword}
              </motion.p>
            )}
          </div>

          <div className="form-group">
            <button 
              type="submit" 
              className="auth-button w-full relative overflow-hidden group" 
              disabled={loading}
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-purple-500 group-hover:bg-purple-700 group-hover:skew-x-12"></span>
              <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-purple-700 group-hover:bg-purple-500 group-hover:-skew-x-12"></span>
              <span className="relative flex items-center justify-center">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    Reset Password
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}
