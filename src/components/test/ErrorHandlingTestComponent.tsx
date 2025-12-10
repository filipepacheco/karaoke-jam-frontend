/**
 * Error Handling Test Component
 * Tests all error handling utilities and alert components
 */

import { useState } from 'react'
import { ErrorAlert } from '../ErrorAlert'
import { SuccessAlert } from '../SuccessAlert'
import { WarningAlert } from '../WarningAlert'
import { InfoAlert } from '../InfoAlert'
import {
  handleApiError,
  isNetworkError,
  isAuthError,
  isPermissionError,
  isValidationError,
  isNotFoundError,
  isServerError,
  getErrorDetails,
} from '../../lib/api'
import type { ApiError } from '../../types/api.types'

export function ErrorHandlingTestComponent() {
  const [activeAlert, setActiveAlert] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<string>('')

  // Mock API errors for testing
  const mockErrors: Record<string, ApiError> = {
    network: {
      message: 'Network error',
      statusCode: 0,
      error: 'NETWORK_ERROR',
    },
    auth: {
      message: 'Unauthorized',
      statusCode: 401,
      error: 'UNAUTHORIZED',
    },
    permission: {
      message: 'Forbidden',
      statusCode: 403,
      error: 'FORBIDDEN',
    },
    validation: {
      message: 'Invalid data',
      statusCode: 400,
      error: 'VALIDATION_ERROR',
    },
    notFound: {
      message: 'Not found',
      statusCode: 404,
      error: 'NOT_FOUND',
    },
    server: {
      message: 'Server error',
      statusCode: 500,
      error: 'SERVER_ERROR',
    },
  }

  const runTest = (testName: string, testFn: () => void) => {
    try {
      testFn()
      setTestResult(`✅ ${testName} passed`)
    } catch (err) {
      setTestResult(`❌ ${testName} failed: ${err}`)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">🚨 Error Handling Testing</h2>
      </div>

      {/* Test Alert Components */}
      <section>
        <h3 className="text-xl font-bold mb-4">Alert Components</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            className="btn btn-error"
            onClick={() => setActiveAlert('error')}
          >
            Test ErrorAlert
          </button>
          <button
            className="btn btn-success"
            onClick={() => setActiveAlert('success')}
          >
            Test SuccessAlert
          </button>
          <button
            className="btn btn-warning"
            onClick={() => setActiveAlert('warning')}
          >
            Test WarningAlert
          </button>
          <button
            className="btn btn-info"
            onClick={() => setActiveAlert('info')}
          >
            Test InfoAlert
          </button>
        </div>

        {/* Alert Display */}
        <div className="mt-4 space-y-2">
          {activeAlert === 'error' && (
            <ErrorAlert
              message="This is an error message"
              title="Error Title"
              onDismiss={() => setActiveAlert(null)}
            />
          )}
          {activeAlert === 'success' && (
            <SuccessAlert
              message="This is a success message"
              title="Success Title"
              onDismiss={() => setActiveAlert(null)}
              autoHide={false}
            />
          )}
          {activeAlert === 'warning' && (
            <WarningAlert
              message="This is a warning message"
              title="Warning Title"
              onDismiss={() => setActiveAlert(null)}
            />
          )}
          {activeAlert === 'info' && (
            <InfoAlert
              message="This is an info message"
              title="Info Title"
              onDismiss={() => setActiveAlert(null)}
            />
          )}
        </div>
      </section>

      {/* Test Error Handler Functions */}
      <section>
        <h3 className="text-xl font-bold mb-4">Error Handler Functions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            className="btn btn-outline"
            onClick={() =>
              runTest('handleApiError', () => {
                const msg = handleApiError(mockErrors.auth)
                if (!msg) throw new Error('No message returned')
              })
            }
          >
            handleApiError()
          </button>
          <button
            className="btn btn-outline"
            onClick={() =>
              runTest('getErrorDetails', () => {
                const details = getErrorDetails(mockErrors.server)
                if (!details) throw new Error('No details returned')
              })
            }
          >
            getErrorDetails()
          </button>
        </div>
      </section>

      {/* Test Error Type Checking */}
      <section>
        <h3 className="text-xl font-bold mb-4">Error Type Detection</h3>
        <div className="space-y-2">
          {Object.entries(mockErrors).map(([key, error]) => (
            <div key={key} className="card bg-base-200">
              <div className="card-body">
                <h4 className="font-bold capitalize">{key} Error</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    isNetworkError:{' '}
                    <span className={isNetworkError(error) ? 'text-success' : 'text-error'}>
                      {isNetworkError(error) ? '✓' : '✗'}
                    </span>
                  </div>
                  <div>
                    isAuthError:{' '}
                    <span className={isAuthError(error) ? 'text-success' : 'text-error'}>
                      {isAuthError(error) ? '✓' : '✗'}
                    </span>
                  </div>
                  <div>
                    isPermissionError:{' '}
                    <span className={isPermissionError(error) ? 'text-success' : 'text-error'}>
                      {isPermissionError(error) ? '✓' : '✗'}
                    </span>
                  </div>
                  <div>
                    isValidationError:{' '}
                    <span className={isValidationError(error) ? 'text-success' : 'text-error'}>
                      {isValidationError(error) ? '✓' : '✗'}
                    </span>
                  </div>
                  <div>
                    isNotFoundError:{' '}
                    <span className={isNotFoundError(error) ? 'text-success' : 'text-error'}>
                      {isNotFoundError(error) ? '✓' : '✗'}
                    </span>
                  </div>
                  <div>
                    isServerError:{' '}
                    <span className={isServerError(error) ? 'text-success' : 'text-error'}>
                      {isServerError(error) ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Test Results */}
      {testResult && (
        <div className={`alert ${testResult.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>
          <span>{testResult}</span>
        </div>
      )}

      {/* Documentation */}
      <div className="alert alert-info">
        <div>
          <h4 className="font-bold">📖 Testing Guide</h4>
          <ol className="list-decimal list-inside text-sm space-y-1 mt-2">
            <li>Click alert buttons to test each component display</li>
            <li>Use "Test" buttons to verify handler functions work</li>
            <li>Check error type detection with mock errors</li>
            <li>All checks should pass (show ✓ in green)</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

