/**
 * Needed Musicians Display Component
 * Shows the needed musicians badges for a song
 */

interface NeededMusiciansDisplayProps {
  neededDrums?: number
  neededGuitars?: number
  neededVocals?: number
  neededBass?: number
  neededKeys?: number
}

export function NeededMusiciansDisplay({
  neededDrums = 0,
  neededGuitars = 0,
  neededVocals = 0,
  neededBass = 0,
  neededKeys = 0,
}: NeededMusiciansDisplayProps) {
  const totalNeeded = neededDrums + neededGuitars + neededVocals + neededBass + neededKeys

  if (totalNeeded === 0) {
    return null
  }

  return (<div></div>
    // <div className="mt-2 p-2 bg-base-100 rounded text-xs">

    // </div>
  )
}

