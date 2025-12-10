/**
 * Song Info Component
 * Displays song details (title, artist, duration)
 */
import type {MusicResponseDto} from "../../types/api.types.ts";

interface SongInfoProps {
    music: MusicResponseDto
}

export function SongInfo({music}: SongInfoProps) {
    const {title, artist, duration, genre, neededDrums, neededKeys, neededVocals, neededGuitars, neededBass} = music;

    return (
        <div className="flex-1 min-w-0">
            <p className="truncate">
                <span className="font-semibold text-lg">{title || 'Song TBA'}</span>
                <span className="text-sm text-base-content/70 ml-2">by {artist || 'Artist TBA'}</span>
                <span className="text-sm text-base-content/70 ml-1">({genre})</span>
            </p>
            {/* Needed Musicians Badges - Inline with Duration */}
            <div className="flex flex-wrap gap-1 mt-1">
                {duration && (<span className="badge badge-m">⏱️ {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}</span>)}
                {(neededDrums || 0) > 0 && (<span className="badge badge-m">🥁 {neededDrums}</span>)}
                {(neededGuitars || 0) > 0 && (<span className="badge badge-m">🎸 {neededGuitars}</span>)}
                {(neededVocals || 0) > 0 && (<span className="badge badge-m">🎤 {neededVocals}</span>)}
                {(neededBass || 0) > 0 && (<span className="badge badge-m">🎸 {neededBass}</span>)}
                {(neededKeys || 0) > 0 && (<span className="badge badge-m">🎹 {neededKeys}</span>)}
            </div>
        </div>
    )
}

