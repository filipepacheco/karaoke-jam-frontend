/**
 * Service Testing Page
 * Optional page for developers to test services
 *
 * To use this:
 * 1. Create a route for /dev/test or /admin/test
 * 2. Import and render TestPage component
 * 3. Run tests from the UI
 */

import { ServiceTestComponent } from '../components/ServiceTestComponent'
import type {JSX} from "react";

/**
 * Testing Page Component
 */
export function TestPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🧪 Service Testing</h1>
          <p className="text-gray-600">
            Test all backend integration services from the UI
          </p>
        </div>

        <ServiceTestComponent />

        <div className="mt-8 space-y-4">
          <div className="alert alert-warning">
            <span>
              ⚠️ This page is for development only. Remove or disable in production.
            </span>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">📖 Testing Guide</h2>
              <p>
                See <code>docs/TESTING-GUIDE.md</code> for detailed testing instructions and console commands.
              </p>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">✅ What Gets Tested</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Jam Service - Create, list, fetch jams</li>
                <li>Musician Service - Create, list, fetch musicians</li>
                <li>Music Service - Create, list, fetch music</li>
                <li>Registration Service - Coming soon</li>
                <li>Schedule Service - Coming soon</li>
              </ul>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">🐛 Troubleshooting</h2>
              <p>If tests fail:</p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Verify backend is running on http://localhost:3000</li>
                <li>Check browser console (F12) for errors</li>
                <li>Check network tab for failed requests</li>
                <li>Verify API_URL environment variable is set</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage

