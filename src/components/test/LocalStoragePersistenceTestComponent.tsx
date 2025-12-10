/**
 * localStorage Persistence Test Component
 * Tests that auth data persists across page reloads
 */

import { useState } from 'react'
import { useAuth } from '../../hooks'
import { getRoleLabel } from '../../lib/auth'

export function LocalStoragePersistenceTestComponent() {
  const auth = useAuth()
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (result: string) => {
    setTestResults((prev) => [result, ...prev.slice(0, 9)])
  }

  const testPersistence = () => {
    const authToken = localStorage.getItem('auth_token')
    const authUser = localStorage.getItem('auth_user')
    const userRole = localStorage.getItem('auth_user')
      ? JSON.parse(localStorage.getItem('auth_user')!).role
      : null

    if (authToken && authUser) {
      addResult(`✅ Data persisted: Token=${authToken.substring(0, 15)}..., Role=${userRole}`)
    } else {
      addResult('❌ No persisted data found')
    }
  }

  const testReloadBehavior = () => {
    if (auth.user) {
      addResult(
        `✅ User ${auth.user.name} loaded after initialization. Role: ${getRoleLabel(auth.role)}`
      )
    } else {
      addResult('❌ No user loaded')
    }
  }

  const manualReloadTest = () => {
    addResult('🔄 Reload the page (F5 or Cmd+R) and come back to see if user data persisted')
  }

  const clearAndTest = () => {
    auth.logout()
    addResult('✅ Cleared all auth data. Data should be gone from localStorage.')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">💾 localStorage Persistence Testing</h2>
      </div>

      {/* Current State */}
      <section>
        <h3 className="text-xl font-bold mb-4">Current Auth State</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="font-bold">Context State</h4>
              <p className="text-sm">Authenticated: {auth.isAuthenticated ? '✅ Yes' : '❌ No'}</p>
              <p className="text-sm">User: {auth.user?.name || 'None'}</p>
              <p className="text-sm">Role: {getRoleLabel(auth.role)}</p>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="font-bold">localStorage Keys</h4>
              <p className="text-sm">
                auth_token: {localStorage.getItem('auth_token') ? '✅ Exists' : '❌ Missing'}
              </p>
              <p className="text-sm">
                auth_user: {localStorage.getItem('auth_user') ? '✅ Exists' : '❌ Missing'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Test Buttons */}
      <section>
        <h3 className="text-xl font-bold mb-4">Persistence Tests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <button className="btn btn-outline btn-sm" onClick={testPersistence}>
            Check Persisted Data
          </button>
          <button className="btn btn-outline btn-sm" onClick={testReloadBehavior}>
            Test Auth Initialization
          </button>
          <button className="btn btn-warning btn-sm" onClick={manualReloadTest}>
            Manual Reload Test (F5)
          </button>
          <button className="btn btn-error btn-sm" onClick={clearAndTest} disabled={!auth.isAuthenticated}>
            Clear Auth Data
          </button>
        </div>
      </section>

      {/* How to Test */}
      <section className="alert alert-info">
        <div>
          <h4 className="font-bold mb-2">📋 How to Test localStorage Persistence</h4>
          <ol className="list-decimal list-inside text-sm space-y-2">
            <li>Log in with a role (Musician, Host, or Viewer) on the Auth Context test page</li>
            <li>Come back to this page</li>
            <li>Click "Check Persisted Data" to see what's stored</li>
            <li>Click "Manual Reload Test" to get instructions</li>
            <li>Reload the page (F5 or Cmd+R)</li>
            <li>You should still be logged in with the same user and role</li>
            <li>Role badge in navbar should show your role after reload</li>
            <li>Click "Clear Auth Data" to test logout persistence</li>
            <li>Refresh - you should be back to viewer role</li>
          </ol>
        </div>
      </section>

      {/* Detailed Storage Info */}
      <section>
        <h3 className="text-xl font-bold mb-4">Detailed Storage Info</h3>
        <div className="card bg-base-200">
          <div className="card-body text-sm space-y-2">
            <div>
              <h4 className="font-bold">auth_token:</h4>
              <pre className="bg-base-300 p-2 rounded text-xs overflow-auto max-h-24">
                {localStorage.getItem('auth_token') || 'Not set'}
              </pre>
            </div>
            <div>
              <h4 className="font-bold">auth_user:</h4>
              <pre className="bg-base-300 p-2 rounded text-xs overflow-auto max-h-24">
                {localStorage.getItem('auth_user')
                  ? JSON.stringify(JSON.parse(localStorage.getItem('auth_user')!), null, 2)
                  : 'Not set'}
              </pre>
            </div>
          </div>
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
    </div>
  )
}

