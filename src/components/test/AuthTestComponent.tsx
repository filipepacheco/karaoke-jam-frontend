/**
 * Authentication Test Component
 * Tests all authentication utilities
 */

import { useState, useEffect } from 'react'
import { setToken, getToken, removeToken, isAuthenticated, clearAuth } from '../../lib/auth'

/**
 * Create a mock JWT token for testing
 * @param payload - Data to encode in token
 * @returns Base64-encoded mock JWT
 */
function createToken(payload: Record<string, unknown> = {}): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const claims = {
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    ...payload,
  }

  // Create a simple base64 encoding (not cryptographically secure - for testing only)
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedClaims = btoa(JSON.stringify(claims))
  const signature = 'test_signature_' + Math.random().toString(36).substr(2, 9)

  return `${encodedHeader}.${encodedClaims}.${signature}`
}

export function AuthTestComponent() {
  const [token, setTokenState] = useState<string>('')
  const [displayToken, setDisplayToken] = useState<string | null>(null)
  const [isAuth, setIsAuth] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    // Load token from localStorage on mount
    const storedToken = getToken()
    setDisplayToken(storedToken)
    setIsAuth(isAuthenticated())
  }, [])

  const handleGenerateToken = () => {
    const newToken = createToken({
      sub: 'test-user-' + Math.random().toString(36).substr(2, 9),
      email: 'test@example.com',
      name: 'Test User',
    })
    setTokenState(newToken)
    addResult('✅ Mock token generated')
  }

  const handleSetToken = () => {
    if (!token.trim()) {
      alert('Enter a token first')
      return
    }
    setToken(token)
    setDisplayToken(token)
    setIsAuth(true)
    addResult('✅ Token set successfully')
  }

  const handleGetToken = () => {
    const retrieved = getToken()
    setDisplayToken(retrieved)
    addResult(`✅ Retrieved token: ${retrieved ? '(exists)' : '(none)'}`)
  }

  const handleRemoveToken = () => {
    removeToken()
    setDisplayToken(null)
    setIsAuth(false)
    addResult('✅ Token removed')
  }

  const handleCheckAuth = () => {
    const auth = isAuthenticated()
    setIsAuth(auth)
    addResult(`✅ Authenticated: ${auth}`)
  }

  const handleClearAuth = () => {
    clearAuth()
    setDisplayToken(null)
    setIsAuth(false)
    setToken('')
    addResult('✅ Auth cleared')
  }

  const addResult = (result: string) => {
    setTestResults((prev) => [result, ...prev.slice(0, 4)])
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">🔐 Authentication Testing</h2>
      </div>

      {/* Token Generation */}
      <section>
        <h3 className="text-xl font-bold mb-4">Generate Mock Token</h3>
        <button className="btn btn-secondary" onClick={handleGenerateToken}>
          Generate Test Token
        </button>
        <p className="text-sm text-gray-500 mt-2">Creates a mock JWT for testing</p>
      </section>

      {/* Token Input */}
      <section>
        <h3 className="text-xl font-bold mb-4">Set Token</h3>
        <div className="flex gap-2">
          <input
            type="text"
            className="input input-bordered flex-1"
            placeholder="Enter JWT token"
            value={token}
            onChange={(e) => setTokenState(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSetToken}>
            Set Token
          </button>
        </div>
      </section>

      {/* Current Token Display */}
      <section>
        <h3 className="text-xl font-bold mb-4">Current Token</h3>
        <div className="card bg-base-200">
          <div className="card-body">
            {displayToken ? (
              <>
                <p className="text-sm break-all">{displayToken}</p>
                <p className="text-xs text-success">✓ Token stored</p>
              </>
            ) : (
              <p className="text-sm text-warning">No token stored</p>
            )}
          </div>
        </div>
      </section>

      {/* Authentication Status */}
      <section>
        <h3 className="text-xl font-bold mb-4">Authentication Status</h3>
        <div className={`alert ${isAuth ? 'alert-success' : 'alert-warning'}`}>
          <span>{isAuth ? '✅ Authenticated' : '⚠️ Not Authenticated'}</span>
        </div>
      </section>

      {/* Test Functions */}
      <section>
        <h3 className="text-xl font-bold mb-4">Test Functions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <button className="btn btn-outline btn-sm" onClick={handleGetToken}>
            getToken()
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleRemoveToken}>
            removeToken()
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleCheckAuth}>
            isAuthenticated()
          </button>
          <button className="btn btn-outline btn-sm col-span-2 md:col-span-1" onClick={handleClearAuth}>
            clearAuth()
          </button>
        </div>
      </section>

      {/* Test Results */}
      {testResults.length > 0 && (
        <section>
          <h3 className="text-xl font-bold mb-4">Test Results</h3>
          <div className="space-y-2">
            {testResults.map((result, idx) => (
              <div key={idx} className="alert alert-success text-sm">
                <span>{result}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Documentation */}
      <div className="alert alert-info">
        <div>
          <h4 className="font-bold">📖 How to Test</h4>
          <ol className="list-decimal list-inside text-sm space-y-1 mt-2">
            <li>Click "Generate Test Token" to create a mock JWT</li>
            <li>Or enter a test JWT token in the input field</li>
            <li>Click "Set Token" to store it in localStorage</li>
            <li>Click other buttons to test different functions</li>
            <li>Token should persist in browser localStorage</li>
            <li>Refresh page - token should still be there</li>
            <li>Click "clearAuth()" to remove token</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

