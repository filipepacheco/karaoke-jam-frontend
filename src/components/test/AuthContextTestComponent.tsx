/**
 * Auth Context Test Component
 * Tests role-based authentication context functionality
 */

import {useState} from 'react'
import {useAuth} from '../../hooks'
import type {AuthUser, UserRole} from '../../types/auth.types'
import {canAccess, canCreateJam, canRegisterForJam, getDefaultRedirectByRole, getRoleLabel,} from '../../lib/auth'

export function AuthContextTestComponent() {
  const auth = useAuth()
  const [testResults, setTestResults] = useState<string[]>([])
  const [selectedRole, setSelectedRole] = useState<UserRole>('viewer')

  const addResult = (result: string) => {
    setTestResults((prev) => [result, ...prev.slice(0, 9)])
  }

  const handleLogin = (role: UserRole) => {
    const mockUser: AuthUser = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      name: role === 'host' ? 'John Host' : role === 'user' ? 'Jane Musician' : null,
      email: `${role}@test.com`,
      role,
      isHost: role === 'host',
      ...(role === 'user' && { instrument: 'Guitar', level: 'INTERMEDIATE' }),
      ...(role === 'host' && { hostName: 'John Host', hostContact: 'john@host.com' }),
    }

    auth.login(mockUser, `mock-token-${role}`)
    addResult(`✅ Logged in as ${getRoleLabel(role)}`)
  }

  const handleLogout = () => {
    auth.logout()
    addResult('✅ Logged out')
  }

  const handleSwitchRole = (newRole: UserRole) => {
    auth.setRole(newRole)
    setSelectedRole(newRole)
    addResult(`✅ Switched role to ${getRoleLabel(newRole)}`)
  }

  const testPermissions = () => {
    const canCreateJams = canCreateJam(auth.user)
    const canRegister = canRegisterForJam(auth.user)
    addResult(`Can create jam: ${canCreateJams ? '✓' : '✗'}, Can register: ${canRegister ? '✓' : '✗'}`)
  }

  const testRoleAccess = () => {
    const userCanAccess = canAccess(auth.role, 'user')
    const hostCanAccess = canAccess(auth.role, 'host')
    addResult(`Can access user level: ${userCanAccess ? '✓' : '✗'}, Can access host level: ${hostCanAccess ? '✓' : '✗'}`)
  }

  const testRedirectPath = () => {
    const path = getDefaultRedirectByRole(auth.role)
    addResult(`Default redirect: ${path}`)
  }

  const testUpdateUser = () => {
    if (auth.user) {
      auth.updateUser({ name: 'Updated Name' })
      addResult(`✅ Updated user name to: ${auth.user.name}`)
    } else {
      addResult('❌ No user logged in')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">🔐 Auth Context Testing</h2>
      </div>

      {/* Current Auth State */}
      <section>
        <h3 className="text-xl font-bold mb-4">Current Auth State</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="font-bold">User Info</h4>
              {auth.user ? (
                <>
                  <p className="text-sm">ID: {auth.user.id}</p>
                  <p className="text-sm">Name: {auth.user.name}</p>
                  <p className="text-sm">Email: {auth.user.email}</p>
                  <p className="text-sm">Role: {getRoleLabel(auth.user.role)}</p>
                </>
              ) : (
                <p className="text-sm text-warning">Not authenticated</p>
              )}
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="font-bold">Context State</h4>
              <p className="text-sm">Authenticated: {auth.isAuthenticated ? '✅ Yes' : '❌ No'}</p>
              <p className="text-sm">Loading: {auth.isLoading ? '⏳ Yes' : '✅ No'}</p>
              <p className="text-sm">Current Role: {getRoleLabel(auth.role)}</p>
              <p className="text-sm">Is Host: {auth.user?.isHost ? '✅ Yes' : '❌ No'}</p>
              <p className="text-sm">Is User: {auth.isUser() ? '✅ Yes' : '❌ No'}</p>
              <p className="text-sm">Is Viewer: {auth.isViewer() ? '✅ Yes' : '❌ No'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Login Buttons */}
      <section>
        <h3 className="text-xl font-bold mb-4">Login</h3>
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-secondary btn-sm" onClick={() => handleLogin('viewer')}>
            Login as Viewer
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => handleLogin('user')}>
            Login as Musician
          </button>
          <button className="btn btn-accent btn-sm" onClick={() => handleLogin('host')}>
            Login as Host
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleLogout}
            disabled={!auth.isAuthenticated}
          >
            Logout
          </button>
        </div>
      </section>

      {/* Role Switching */}
      {auth.isAuthenticated && (
        <section>
          <h3 className="text-xl font-bold mb-4">Switch Role</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              className={`btn btn-sm ${auth.role === 'viewer' ? 'btn-active' : 'btn-outline'}`}
              onClick={() => handleSwitchRole('viewer')}
            >
              Viewer
            </button>
            <button
              className={`btn btn-sm ${auth.role === 'user' ? 'btn-active' : 'btn-outline'}`}
              onClick={() => handleSwitchRole('user')}
            >
              Musician
            </button>
            <button
              className={`btn btn-sm ${auth.role === 'host' ? 'btn-active' : 'btn-outline'}`}
              onClick={() => handleSwitchRole('host')}
            >
              Host
            </button>
          </div>
        </section>
      )}

      {/* Test Functions */}
      <section>
        <h3 className="text-xl font-bold mb-4">Test Functions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <button className="btn btn-outline btn-sm" onClick={testPermissions}>
            Test Permissions
          </button>
          <button className="btn btn-outline btn-sm" onClick={testRoleAccess}>
            Test Role Access
          </button>
          <button className="btn btn-outline btn-sm" onClick={testRedirectPath}>
            Test Redirect Path
          </button>
          <button className="btn btn-outline btn-sm" onClick={testUpdateUser} disabled={!auth.user}>
            Update User
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

      {/* localStorage Info */}
      <section>
        <h3 className="text-xl font-bold mb-4">localStorage</h3>
        <div className="card bg-base-200">
          <div className="card-body text-sm space-y-1">
            <p>
              auth_token:{' '}
              <span className="font-mono">
                {localStorage.getItem('auth_token')?.substring(0, 20)}...
              </span>
            </p>
            <p>
              auth_user:{' '}
              <span className="font-mono">
                {localStorage.getItem('auth_user')?.substring(0, 50)}...
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Data persists across page refreshes
            </p>
          </div>
        </div>
      </section>

      {/* Documentation */}
      <div className="alert alert-info">
        <div>
          <h4 className="font-bold">📖 How to Test</h4>
          <ol className="list-decimal list-inside text-sm space-y-1 mt-2">
            <li>Login with different roles (Viewer, Musician, Host)</li>
            <li>Check that user info displays correctly</li>
            <li>Switch between roles and verify context updates</li>
            <li>Test permissions and access levels</li>
            <li>Refresh page - data should persist in localStorage</li>
            <li>Logout and verify state is cleared</li>
            <li>Check localStorage section to see persisted data</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

