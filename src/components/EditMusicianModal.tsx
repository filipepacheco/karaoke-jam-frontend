/**
 * Edit Musician Modal
 * Modal form for editing musician details
 */

import {useState} from 'react'
import type {MusicianLevel, MusicianResponseDto} from '../types/api.types'

interface EditMusicianModalProps {
  musician: MusicianResponseDto
  onSave: (musician: MusicianResponseDto) => void
  onClose: () => void
}

export function EditMusicianModal({ musician, onSave, onClose }: EditMusicianModalProps) {
  const [formData, setFormData] = useState({
    name: musician.name,
    instrument: musician.instrument,
    level: musician.level as MusicianLevel,
    contact: musician.contact,
    phone: musician.phone || '',
  })

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }

    if (!formData.instrument.trim()) {
      setError('Instrument is required')
      return
    }

    if (!formData.contact.trim()) {
      setError('Contact is required')
      return
    }

    setIsLoading(true)

    try {
      const updatedMusician: MusicianResponseDto = {
        ...musician,
        ...formData,
      }

      onSave(updatedMusician)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update musician')
      setIsLoading(false)
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        {/* Header */}
        <h3 className="font-bold text-lg mb-4">Edit Musician</h3>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Musician ID (read-only) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Musician ID</span>
            </label>
            <input
              type="text"
              value={musician.id}
              disabled
              className="input input-bordered input-disabled"
            />
          </div>

          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input input-bordered"
              placeholder="Enter musician name"
              disabled={isLoading}
            />
          </div>

          {/* Instrument */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Instrument</span>
            </label>
            <input
              type="text"
              name="instrument"
              value={formData.instrument}
              onChange={handleInputChange}
              className="input input-bordered"
              placeholder="e.g., Guitar, Drums, Bass"
              disabled={isLoading}
            />
          </div>

          {/* Level */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Level</span>
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="select select-bordered"
              disabled={isLoading}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="PROFESSIONAL">Professional</option>
            </select>
          </div>

          {/* Contact */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Contact (Email/Primary)</span>
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className="input input-bordered"
              placeholder="e.g., email@example.com"
              disabled={isLoading}
            />
          </div>

          {/* Phone */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Phone</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="input input-bordered"
              placeholder="e.g., (555) 123-4567"
              disabled={isLoading}
            />
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>
  )
}

