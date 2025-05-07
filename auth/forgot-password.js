"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import AuthLayout from "./auth-layout"
import { Mail, AlertCircle, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState({
    email: ""
  })

  // Form validation
  const validateForm = () => {
    let valid = true
    const newErrors = { email: "" }
    
    // Email validation
    if (!email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid"
      valid = false
    }
    
    setFormErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    
    // Validate form
    if (!validateForm()) return
    
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes, we'll just show success
      setSuccess(true)
    } catch (error) {
      setError("Failed to send password reset email. Please try again.")
      console.error(error)
    }

    setLoading(false)
  }

  return (
    <AuthLayout 
      title="Reset Password"
      subtitle="We'll send you a link to reset your password"
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
            <h3 className="text-xl font-bold mb-2">Check Your Email</h3>
            <p className="mb-0">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions.
            </p>
          </div>
          
          <p className="text-purple-200 mb-4">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                setSuccess(false)
                setEmail("")
              }}
              className="py-2 px-4 bg-purple-700 hover:bg-purple-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              Try Again
            </button>
            
            <Link
              href="/auth/login"
              className="py-2 px-4 bg-transparent border border-purple-500/50 hover:bg-purple-500/20 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label htmlFor="email" className="form-label text-white">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className={`form-input pl-10 ${formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (formErrors.email) {
                      setFormErrors({...formErrors, email: ""})
                    }
                  }}
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300" />
              </div>
              {formErrors.email && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-red-400 text-xs mt-1"
                >
                  {formErrors.email}
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
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/auth/login" 
              className="text-purple-300 hover:text-white inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </>
      )}
    </AuthLayout>
  )
}
