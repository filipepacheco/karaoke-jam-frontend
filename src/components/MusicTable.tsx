/**
 * Music Table Row Component
 * Displays a single music entry in the table with actions
 */

import type {MusicResponseDto} from '../types/api.types'

interface MusicTableRowProps {
  music: MusicResponseDto
  formatDuration: (seconds?: number) => string
  isHost: boolean
  onEdit: (music: MusicResponseDto) => void
  onDelete: (music: MusicResponseDto) => void
  onApprove?: (music: MusicResponseDto) => void
  onReject?: (music: MusicResponseDto) => void
}

export function MusicTableRow({
  music,
  formatDuration,
  isHost,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: MusicTableRowProps) {
  return (
    <tr className="hover">
      <td className="font-semibold">{music.title}</td>
      <td>{music.artist}</td>
      <td>
        <span className="badge badge-outline">{music.genre || 'Unknown'}</span>
      </td>
      <td>{formatDuration(music.duration)}</td>
      <td>
        {music.link ? (
          <a
            href={music.link}
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary text-sm truncate"
            title={music.link}
          >
            🔗 Link
          </a>
        ) : (
          <span className="text-xs text-base-content/50">-</span>
        )}
      </td>
      <td>
        <div
          className={`badge badge-lg ${music.status === 'SUGGESTED' ? 'badge-warning' : 'badge-success'}`}
        >
          {music.status === 'SUGGESTED' ? '💡 Suggested' : '✅ Approved'}
        </div>
      </td>
      <td>
        <MusiciansBadges music={music} />
      </td>
      <td>
        <MusicActionButtons
          music={music}
          isHost={isHost}
          onEdit={onEdit}
          onDelete={onDelete}
          onApprove={onApprove}
          onReject={onReject}
        />
      </td>
    </tr>
  )
}

/**
 * Musicians Badges Component
 * Displays needed musicians for a song
 */
interface MusiciansBadgesProps {
  music: MusicResponseDto
}

export function MusiciansBadges({ music }: MusiciansBadgesProps) {
  const instrumentCounts = [
    { count: music.neededDrums || 0, emoji: '🥁', label: 'Drums' },
    { count: music.neededGuitars || 0, emoji: '🎸', label: 'Guitars' },
    { count: music.neededVocals || 0, emoji: '🎤', label: 'Vocals' },
    { count: music.neededBass || 0, emoji: '🎸', label: 'Bass' },
    { count: music.neededKeys || 0, emoji: '🎹', label: 'Keys' },
  ]

  const hasInstruments = instrumentCounts.some((inst) => inst.count > 0)

  return (
    <div className="flex flex-wrap gap-1">
      {instrumentCounts.map((inst) =>
        inst.count > 0 ? (
          <span key={inst.label} className="badge badge-sm">
            {inst.emoji} {inst.count}
          </span>
        ) : null
      )}
      {!hasInstruments && <span className="text-xs text-base-content/50">None</span>}
    </div>
  )
}

/**
 * Music Action Buttons Component
 * Displays action buttons based on user role and song status
 */
interface MusicActionButtonsProps {
  music: MusicResponseDto
  isHost: boolean
  onEdit: (music: MusicResponseDto) => void
  onDelete: (music: MusicResponseDto) => void
  onApprove?: (music: MusicResponseDto) => void
  onReject?: (music: MusicResponseDto) => void
}

function MusicActionButtons({
  music,
  isHost,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: MusicActionButtonsProps) {
  const isSuggested = music.status === 'SUGGESTED'

  return (
    <div className="flex gap-1 flex-wrap">
      {isSuggested && isHost ? (
        <>
          <button
            onClick={() => onApprove?.(music)}
            className="btn btn-xs btn-success"
            title="Approve this song"
          >
            ✅
          </button>
          <button
            onClick={() => onReject?.(music)}
            className="btn btn-xs btn-error btn-outline"
            title="Reject this song"
          >
            ❌
          </button>
        </>
      ) : isHost && !isSuggested ? (
        <>
          <button
            onClick={() => onEdit(music)}
            className="btn btn-xs btn-ghost"
            title="Edit this song"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(music)}
            className="btn btn-xs btn-error btn-outline"
            title="Delete this song"
          >
            🗑️
          </button>
        </>
      ) : (
        <span className="text-xs text-base-content/50">-</span>
      )}
    </div>
  )
}

