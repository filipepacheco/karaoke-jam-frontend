/**
 * Schedule Status Badge Component
 * Displays schedule status with appropriate color and icon
 */

interface ScheduleStatusBadgeProps {
  status: string | undefined
}

export function ScheduleStatusBadge({ status }: ScheduleStatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'SUGGESTED':
        return 'badge-info'
      case 'SCHEDULED':
        return 'badge-secondary'
      case 'IN_PROGRESS':
        return 'badge-warning'
      case 'COMPLETED':
        return 'badge-success'
      case 'CANCELED':
        return 'badge-error'
      default:
        return 'badge-outline'
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case 'SUGGESTED':
        return 'Suggested'
      case 'SCHEDULED':
        return 'Scheduled'
      case 'IN_PROGRESS':
        return 'In Progress'
      case 'COMPLETED':
        return 'Completed'
      case 'CANCELED':
        return 'Canceled'
      default:
        return 'Scheduled'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'SUGGESTED':
        return '✨'
      case 'SCHEDULED':
        return '📅'
      case 'IN_PROGRESS':
        return '🎵'
      case 'COMPLETED':
        return '✓'
      case 'CANCELED':
        return '✕'
      default:
        return ''
    }
  }

  return (
      <>
          <div className={`badge ${getStatusColor()}`}>
              {getStatusIcon() && `${getStatusIcon()} `}
              {getStatusLabel()}
          </div>
      </>

  )
}

