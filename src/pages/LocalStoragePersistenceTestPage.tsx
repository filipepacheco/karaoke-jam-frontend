/**
 * localStorage Persistence Test Page
 */

import { LocalStoragePersistenceTestComponent } from '../components/test/LocalStoragePersistenceTestComponent'

export function LocalStoragePersistenceTestPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto max-w-7xl">
        <div className="navbar bg-base-200 rounded-box mt-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">💾 localStorage Persistence Tests</h1>
          </div>
          <div className="flex-none">
            <a href="/" className="btn btn-ghost btn-sm">
              ← Back to Home
            </a>
          </div>
        </div>

        <LocalStoragePersistenceTestComponent />
      </div>
    </div>
  )
}

export default LocalStoragePersistenceTestPage

