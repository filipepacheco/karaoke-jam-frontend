/**
 * OAuth Button Component
 * Reusable button component for OAuth provider logins with theme-aware styling
 */

import type {OAuthProvider} from '../../lib/supabase'
import {providerIcons, providerLabels} from '../../lib/musicUtils'

interface OAuthButtonProps {
  provider: OAuthProvider
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

export function OAuthButton({
  provider,
  onClick,
  disabled = false,
  loading = false,
  fullWidth = true,
}: OAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-outline ${fullWidth ? 'w-full' : ''}`}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Connecting...
        </>
      ) : (
        <>
          {providerIcons[provider]}
          Continue with {providerLabels[provider]}
        </>
      )}
    </button>
  )
}

export default OAuthButton

