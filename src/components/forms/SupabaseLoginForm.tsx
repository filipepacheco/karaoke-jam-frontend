/**
 * Supabase Login Form Component
 * Email/password login with social OAuth buttons
 */

import * as React from 'react'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../hooks'
import type {OAuthProvider} from '../../lib/supabase'
import {providerIcons, providerLabels} from "../../lib/musicUtils.tsx";

interface SupabaseLoginFormProps {
  onSuccess?: () => void
}

export function SupabaseLoginForm({ onSuccess }: SupabaseLoginFormProps) {
  const navigate = useNavigate()
  const { loginWithEmail, signUpWithEmail, loginWithOAuth, isLoading: authLoading } = useAuth()

  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Get redirect path from URL params
  const getRedirectPath = () => {
    const params = new URLSearchParams(window.location.search)
    const redirectParam = params.get('redirect')
    if (redirectParam) {
      return redirectParam
    }
    const jamId = params.get('jamId')
    if (jamId) {
      return `/jams/${jamId}/register`
    }
    return '/'
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setIsLoading(true)

    try {
      let result: { success: boolean; error?: string }

      if (isSignUp) {
        result = await signUpWithEmail(email, password, name || undefined)
      } else {
        result = await loginWithEmail(email, password)
      }

      if (result.success) {
        if (result.error) {
          // Success with message (e.g., email confirmation required)
          setMessage(result.error)
        } else {
          onSuccess?.()
          navigate(getRedirectPath())
        }
      } else {
        setError(result.error || 'Authentication failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    setError(null)
    setIsLoading(true)

    try {
      // Store redirect path for use after OAuth callback
      const redirectPath = getRedirectPath()
      sessionStorage.setItem('auth_redirect', redirectPath)

      const result = await loginWithOAuth(provider)
      if (!result.success && result.error) {
        setError(result.error)
        setIsLoading(false)
      }
      // If successful, user will be redirected to OAuth provider
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth login failed')
      setIsLoading(false)
    }
  }


  const isFormLoading = isLoading || authLoading

  return (
      <fieldset className="fieldset border-base-300 rounded-box w-sm border p-4">
        <legend className="fieldset-legend  font-bold">{isSignUp ? 'Create Account' : 'Sign In'}</legend>
        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {/* Name field (only for signup) */}
        {isSignUp && (
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Name</span>
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isFormLoading}
            />
          </div>
        )}

        {/* Email Input */}
        <div >
          <label className="label">
            Email
          </label>
          <input
            type="email"
            placeholder="user@example.com"
            className="input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isFormLoading}
            required
          />
        </div>

        {/* Password Input */}
          <div>
            <label className='label'>
          Password
            </label>
            <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isFormLoading}
                required
                minLength={6}
            />
            {isSignUp && (
                <label className="label">
              <span className="label-text-alt text-xs text-base-content/60">
                Minimum 6 characters
              </span>
                </label>
            )}
          </div>

          {/* Error Alert */}
          {error && (
          <div role="alert" className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div role="alert" className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{message}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isFormLoading || !email || !password}
        >
          {isFormLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {isSignUp ? 'Creating account...' : 'Signing in...'}
            </>
          ) : (
            isSignUp ? 'Create Account' : 'Sign In'
          )}
        </button>

          <div className="divider ">or</div>

          {/* OAuth Buttons */}
          <div className="space-y-2 ">
            <button
                type="button"
                className="btn bg-green w-full text-black border-[#e5e5e5]"
                onClick={() => handleOAuthLogin('google')}
                disabled={isFormLoading}
            >
              {providerIcons.google} Continue with {providerLabels.google}
            </button>
            <button
                type="button"
                className="btn bg-green w-full text-black border-[#e5e5e5]"
                onClick={() => handleOAuthLogin('spotify')}
                disabled={isFormLoading}
            >
              {providerIcons.spotify} Continue with {providerLabels.spotify}
            </button>
          </div>

        </form>

      {/* Toggle Sign Up / Sign In */}
      <div className="divider "></div>
      <div className="text-center">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError(null)
            setMessage(null)
          }}
          disabled={isFormLoading}
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>

      {/* Forgot Password Link */}
      {!isSignUp && (
        <div className="text-center ">
          <a href="/forgot-password" className="link link-hover text-sm text-base-content/60">
            Forgot password?
          </a>
        </div>
      )}
    </fieldset>
  )
}

export default SupabaseLoginForm

