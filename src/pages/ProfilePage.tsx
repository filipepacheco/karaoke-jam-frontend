/**
 * Profile Page
 * Display and edit user profile information
 * Accessible to all authenticated users
 */

import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../hooks'
import type {AuthUser, UpdateProfileDto} from '../types/auth.types'
import {ProfileHeader} from '../components/ProfileHeader'
import {ProfileFormSection} from '../components/ProfileFormSection'
import {ErrorAlert, SuccessAlert} from '../components'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading: authLoading, updateProfile } = useAuth()

  // State
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<AuthUser>>({})

  // Auth guard - redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?redirect=/profile`)
    }
  }, [isAuthenticated, authLoading, navigate])

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        contact: user.contact || '',
        instrument: user.instrument || '',
        genre: user.genre || '',
        level: user.level || '',
        hostName: user.hostName || '',
        hostContact: user.hostContact || '',
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleEditToggle = () => {
    if (isEditMode) {
      // Revert to original data when canceling
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        contact: user?.contact || '',
        instrument: user?.instrument || '',
        genre: user?.genre || '',
        level: user?.level || '',
        hostName: user?.hostName || '',
        hostContact: user?.hostContact || '',
      })
      setError(null)
    }
    setIsEditMode(!isEditMode)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    if (!formData.name?.trim()) {
      setError('Name is required')
      return
    }

    if (!formData.phone?.trim()) {
      setError('Phone is required')
      return
    }

    setIsLoading(true)

    try {
      const updates: UpdateProfileDto = {
        name: formData.name,
        contact: formData.contact,
        instrument: formData.instrument,
        level: formData.level,
      }

      await updateProfile(updates)

      setSuccess('Profile updated successfully!')
      setIsEditMode(false)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Alerts */}
        {error && <ErrorAlert message={error} title="Error" />}
        {success && <SuccessAlert message={success} title="Success" />}

        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {/* Contact Information Section */}
          <ProfileFormSection
            title="Contact Information"
            icon="📞"
            isEditMode={isEditMode}
            fields={[
              {
                name: 'name',
                label: 'Name',
                type: 'text',
                value: formData.name || '',
                onChange: handleInputChange,
                disabled: isLoading,
                readOnly: !isEditMode,
              },
              {
                name: 'email',
                label: 'Email',
                type: 'email',
                value: formData.email || '',
                onChange: handleInputChange,
                disabled: true,
                readOnly: true,
              },
              {
                name: 'phone',
                label: 'Phone',
                type: 'tel',
                value: formData.phone || '',
                onChange: handleInputChange,
                disabled: isLoading || !isEditMode,
                readOnly: !isEditMode,
              },
              {
                name: 'contact',
                label: 'Contact (Email/Messaging)',
                type: 'text',
                value: formData.contact || '',
                onChange: handleInputChange,
                disabled: isLoading || !isEditMode,
                readOnly: !isEditMode,
              },
            ]}
          />

          {/* Musician Profile Section - Only for musicians */}
          {user.role === 'user' && (
            <ProfileFormSection
              title="Musician Profile"
              icon="🎸"
              isEditMode={isEditMode}
              fields={[
                {
                  name: 'instrument',
                  label: 'Instrument',
                  type: 'text',
                  value: formData.instrument || '',
                  onChange: handleInputChange,
                  disabled: isLoading || !isEditMode,
                  readOnly: !isEditMode,
                },
                {
                  name: 'genre',
                  label: 'Genre',
                  type: 'text',
                  value: formData.genre || '',
                  onChange: handleInputChange,
                  disabled: isLoading || !isEditMode,
                  readOnly: !isEditMode,
                },
                {
                  name: 'level',
                  label: 'Level',
                  type: 'select',
                  value: formData.level || '',
                  onChange: handleInputChange,
                  disabled: isLoading || !isEditMode,
                  readOnly: !isEditMode,
                  options: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL'],
                },
              ]}
            />
          )}

          {/* Host Information Section - Only for hosts */}
          {user.isHost && (
            <ProfileFormSection
              title="Host Information"
              icon="🎤"
              isEditMode={isEditMode}
              fields={[
                {
                  name: 'hostName',
                  label: 'Host Name',
                  type: 'text',
                  value: formData.hostName || '',
                  onChange: handleInputChange,
                  disabled: isLoading || !isEditMode,
                  readOnly: !isEditMode,
                },
                {
                  name: 'hostContact',
                  label: 'Host Contact',
                  type: 'text',
                  value: formData.hostContact || '',
                  onChange: handleInputChange,
                  disabled: isLoading || !isEditMode,
                  readOnly: !isEditMode,
                },
              ]}
            />
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center pt-6">
            {!isEditMode ? (
              <button
                type="button"
                onClick={handleEditToggle}
                className="btn btn-primary btn-lg"
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  disabled={isLoading}
                  className="btn btn-ghost btn-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-lg"
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    '💾 Save Changes'
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage

