/**
 * Hook Testing Page
 * Dedicated page for testing all custom hooks
 */

import { HookTestComponent } from '../components/test/HookTestComponent'

export function HookTestPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="navbar bg-base-200 rounded-box mt-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">🪝 Custom Hooks Testing</h1>
          </div>
          <div className="flex-none">
            <a href="/" className="btn btn-ghost btn-sm">
              ← Back to Home
            </a>
          </div>
        </div>

        {/* Main Content */}
        <HookTestComponent />

        {/* Footer Info */}
        <div className="mt-8 mb-4 space-y-4">
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title">📚 Available Hooks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-bold mb-2">List Hooks:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <code>useJams()</code> - Get all jams
                    </li>
                    <li>
                      <code>useMusicians()</code> - Get all musicians
                    </li>
                    <li>
                      <code>useAllMusic()</code> - Get all music
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Single Item Hooks:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <code>useJam(id)</code> - Get jam by ID
                    </li>
                    <li>
                      <code>useMusician(id)</code> - Get musician by ID
                    </li>
                    <li>
                      <code>useMusic(id)</code> - Get music by ID
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Related Data Hooks:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <code>useMusicByJam(jamId)</code> - Get music for jam
                    </li>
                    <li>
                      <code>useRegistrationsByJam(jamId)</code> - Get registrations
                    </li>
                    <li>
                      <code>useRegistrationsByMusician(musicianId)</code> - Get registrations
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Schedule Hooks:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <code>useScheduleByJam(jamId)</code> - Get schedules
                    </li>
                    <li>
                      <code>useScheduleByMusician(musicianId)</code> - Get schedules
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title">🔍 What Each Hook Returns</h3>
              <pre className="text-sm bg-base-300 p-4 rounded-lg overflow-auto">
                {`{
  data: T | null,         // The fetched data (or null if loading/error)
  loading: boolean,       // True while request is in progress
  error: string | null,   // Error message (or null if successful)
  refetch: () => void     // Function to manually refresh data
}`}
              </pre>
            </div>
          </div>

          <div className="alert alert-warning">
            <div>
              <h4 className="font-bold">⚠️ Testing Requirements</h4>
              <ul className="text-sm list-disc list-inside mt-2">
                <li>Backend must be running on http://localhost:3000</li>
                <li>Database should have some test data</li>
                <li>CORS must be enabled on backend</li>
                <li>Check browser console (F12) for detailed errors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HookTestPage

