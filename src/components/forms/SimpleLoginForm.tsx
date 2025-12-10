/**
 * Simple Login Form Component
 * Single input for email or phone login with smart post-login redirects
 */

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks'
import { loginOrRegister } from '../../services'
import { ErrorAlert } from '../index'
import { useNavigate, useLocation } from 'react-router-dom'

export function SimpleLoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Determine redirect destination based on:
  // 1. ?redirect= query param (explicit override)
  // 2. Coming from jam registration flow (?jamId param)
  // 3. Referrer from jam detail page
  // 4. Default to home page
  const getRedirectPath = () => {
    const params = new URLSearchParams(window.location.search)

    // Check for explicit redirect param
    const redirectParam = params.get('redirect')
    if (redirectParam) {
      return redirectParam
    }

    // Check if coming from jam registration flow (has jam context in search)
    const jamId = params.get('jamId')
    if (jamId) {
      return `/jams/${jamId}/register`
    }

    // Check if we came from a jam detail page
    const referer = document.referrer
    if (referer.includes('/jams/')) {
      const match = referer.match(/\/jams\/([^/]+)/)
      if (match) {
        return `/jams/${match[1]}`
      }
    }

    // Default to home
    return '/'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedInput = input.trim()

    // Determine if email or phone
    const isEmail = trimmedInput.includes('@')
    const isPhone = /^\d/.test(trimmedInput.replace(/\D/g, ''))

    if (!isEmail && !isPhone) {
      setError('Please enter a valid email or phone number')
      return
    }

    setIsLoading(true)

    try {
      const result = await loginOrRegister(isEmail ? trimmedInput : undefined, !isEmail ? trimmedInput : undefined)

      // Login successful - update auth context with user and token
      login(result.user, result.token)

      // Redirect to appropriate location based on context
      const redirectPath = getRedirectPath()
      navigate(redirectPath)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/Phone Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Email or Phone Number</span>
            </label>
            <input
              type="text"
              placeholder="user@example.com or 1234567890"
              className="input input-bordered"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            <label className="label">
              <span className="label-text-alt text-xs text-base-content/60">
                Phone numbers should have at least 10 digits
              </span>
            </label>
          </div>

          {/* Error Alert */}
          {error && (
            <ErrorAlert
              message={error}
              title="Login Error"
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? 'Logging in...' : 'Continue'}
          </button>
        </form>

        {/* Info */}
        <div className="divider my-2"></div>
        <p className="text-xs text-base-content/60 text-center">
          By continuing, you agree to create or access your musician account
        </p>
      </div>
    </div>
  )
}

export default SimpleLoginForm

