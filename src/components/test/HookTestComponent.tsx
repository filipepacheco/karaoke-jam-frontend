/**
 * Hook Testing Component
 * Tests all custom hooks with real data
 */

import {useState} from 'react'
import {
  useJams,
  useJam,
  useMusicians,
  useMusician,
  useAllMusic,
  useMusic,
  useMusicByJam,
  useRegistrationsByJam,
  useRegistrationsByMusician,
  useScheduleByJam,
  useScheduleByMusician,
} from '../../hooks'

export function HookTestComponent() {
  const [testJamId, setTestJamId] = useState<string>('')
  const [testMusicianId, setTestMusicianId] = useState<string>('')
  const [testMusicId, setTestMusicId] = useState<string>('')

  // Test all list hooks
  const jamsResult = useJams()
  const musiciansResult = useMusicians()
  const musicResult = useAllMusic()

  // Test single item hooks (only if IDs are provided)
  const jamResult = useJam(testJamId)
  const musicianResult = useMusician(testMusicianId)
  const singleMusicResult = useMusic(testMusicId)

  // Test related data hooks
  const musicByJamResult = useMusicByJam(testJamId)
  const registrationsByJamResult = useRegistrationsByJam(testJamId)
  const registrationsByMusicianResult = useRegistrationsByMusician(testMusicianId)
  const scheduleByJamResult = useScheduleByJam(testJamId)
  const scheduleByMusicianResult = useScheduleByMusician(testMusicianId)

  // Helper to auto-fill IDs from lists
  const fillTestIds = () => {
    if (jamsResult.data && jamsResult.data.length > 0) {
      setTestJamId(jamsResult.data[0].id)
    }
    if (musiciansResult.data && musiciansResult.data.length > 0) {
      setTestMusicianId(musiciansResult.data[0].id)
    }
    if (musicResult.data && musicResult.data.length > 0) {
      setTestMusicId(musicResult.data[0].id)
    }
  }

  const renderHookResult = (
    name: string,
    result: { data: unknown; loading: boolean; error: string | null; refetch: () => void }
  ) => {
    const isArray = Array.isArray(result.data)
    const count = isArray ? (result.data as unknown[]).length : result.data ? 1 : 0

    return (
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body p-4">
          <h3 className="card-title text-sm">
            {name}
            {result.loading && <span className="loading loading-spinner loading-xs"></span>}
          </h3>

          {result.loading && <p className="text-sm">Loading...</p>}

          {result.error && (
            <div className="alert alert-error py-2">
              <span className="text-xs">{result.error}</span>
            </div>
          )}

          {!result.loading && !result.error && (
            <>
              <div className="flex items-center gap-2">
                <span className="badge badge-success text-xs">
                  {count} {isArray ? 'items' : 'item'}
                </span>
                <button className="btn btn-xs btn-outline" onClick={result.refetch}>
                  Refresh
                </button>
              </div>

              {result.data && (
                <details className="collapse collapse-arrow bg-base-100 rounded-box mt-2">
                  <summary className="collapse-title text-xs font-medium cursor-pointer">
                    View Data
                  </summary>
                  <div className="collapse-content">
                    <pre className="text-xs overflow-auto max-h-40 p-2 bg-base-300 rounded">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                </details>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">🪝 Hook Testing</h2>
        <button className="btn btn-primary btn-sm" onClick={fillTestIds}>
          Auto-Fill Test IDs
        </button>
      </div>

      {/* ID Inputs */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="card-title text-lg">Test IDs (for single item hooks)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Jam ID</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm"
                placeholder="Enter jam ID"
                value={testJamId}
                onChange={(e) => setTestJamId(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Musician ID</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm"
                placeholder="Enter musician ID"
                value={testMusicianId}
                onChange={(e) => setTestMusicianId(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Music ID</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm"
                placeholder="Enter music ID"
                value={testMusicId}
                onChange={(e) => setTestMusicId(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* List Hooks */}
      <section>
        <h3 className="text-xl font-bold mb-4">📋 List Hooks (No Parameters)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderHookResult('useJams()', jamsResult)}
          {renderHookResult('useMusicians()', musiciansResult)}
          {renderHookResult('useAllMusic()', musicResult)}
        </div>
      </section>

      {/* Single Item Hooks */}
      <section>
        <h3 className="text-xl font-bold mb-4">🎯 Single Item Hooks (Need IDs)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderHookResult(`useJam('${testJamId}')`, jamResult)}
          {renderHookResult(`useMusician('${testMusicianId}')`, musicianResult)}
          {renderHookResult(`useMusic('${testMusicId}')`, singleMusicResult)}
        </div>
      </section>

      {/* Related Data Hooks */}
      <section>
        <h3 className="text-xl font-bold mb-4">🔗 Related Data Hooks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderHookResult(`useMusicByJam('${testJamId}')`, musicByJamResult)}
          {renderHookResult(`useRegistrationsByJam('${testJamId}')`, registrationsByJamResult)}
          {renderHookResult(
            `useRegistrationsByMusician('${testMusicianId}')`,
            registrationsByMusicianResult
          )}
          {renderHookResult(`useScheduleByJam('${testJamId}')`, scheduleByJamResult)}
          {renderHookResult(
            `useScheduleByMusician('${testMusicianId}')`,
            scheduleByMusicianResult
          )}
        </div>
      </section>

      {/* Instructions */}
      <div className="alert alert-info">
        <div>
          <h4 className="font-bold">How to Test:</h4>
          <ol className="list-decimal list-inside text-sm space-y-1 mt-2">
            <li>Make sure backend is running on http://localhost:3000</li>
            <li>Click "Auto-Fill Test IDs" to populate IDs from fetched data</li>
            <li>Or manually enter IDs in the input fields above</li>
            <li>Watch hooks fetch data in real-time</li>
            <li>Click "Refresh" on any card to manually refetch</li>
            <li>Expand "View Data" to see the actual response</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

