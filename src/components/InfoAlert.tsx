/**
 * Info Alert Component
 * Displays informational messages with daisyUI styling
 */

interface InfoAlertProps {
  message: string
  title?: string
  onDismiss?: () => void
  className?: string
}

/**
 * Info Alert Component
 * Shows informational message in a blue alert box
 */
export function InfoAlert({ message, title, onDismiss, className = '' }: InfoAlertProps) {
  if (!message) return null

  return (
    <div className={`alert alert-info ${className}`} role="alert">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-current shrink-0 w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <div className="flex-1">
        {title && <h3 className="font-bold">{title}</h3>}
        <div className="text-sm">{message}</div>
      </div>
      {onDismiss && (
        <button className="btn btn-sm btn-ghost" onClick={onDismiss} aria-label="Dismiss info">
          ✕
        </button>
      )}
    </div>
  )
}

