/**
 * Schedule Action Buttons Component
 * Renders appropriate action buttons based on schedule status
 */

interface ScheduleActionButtonsProps {
    status: string | undefined
    loading?: boolean
    isSuggested?: boolean
    onStatusChange?: (status: string) => void
    onDelete?: () => void
}

export function ScheduleActionButtons({
                                          status, loading = false, isSuggested = false, onStatusChange, onDelete,
                                      }: ScheduleActionButtonsProps) {
    return (<div className="flex flex-col gap-1">
            {/* Suggested action buttons */}
            {isSuggested && (<>
                    <button
                        onClick={() => onStatusChange?.('SCHEDULED')}
                        className="btn btn-sm btn-success"
                        disabled={loading}
                    >
                        ✓ Approve
                    </button>
                    <button
                        onClick={onDelete}
                        className="btn btn-sm btn-error"
                        disabled={loading}
                    >
                        ✕ Reject
                    </button>
                </>)}

            {/* Non-suggested action buttons */}
            {!isSuggested && (<>
                    {(status === 'SCHEDULED' || !status) && (<button
                            onClick={() => onStatusChange?.('IN_PROGRESS')}
                            className="btn btn-sm btn-warning"
                            disabled={loading}
                        >
                            ▶️ Start
                        </button>)}
                    {status === 'IN_PROGRESS' && (<>
                            <button
                                onClick={() => onStatusChange?.('COMPLETED')}
                                className="btn btn-sm btn-success"
                                disabled={loading}
                            >
                                ✓ Complete
                            </button>
                            <button
                                onClick={() => onStatusChange?.('CANCELED')}
                                className="btn btn-sm btn-error btn-outline"
                                disabled={loading}
                            >
                                ✕ Cancel
                            </button>
                        </>)}
                    {status === 'CANCELED' && (<button
                            onClick={() => onStatusChange?.('SCHEDULED')}
                            className="btn btn-sm btn-outline"
                            disabled={loading}
                        >
                            🔄 Reschedule
                        </button>)}
                    {status === 'COMPLETED' && (<span className="text-xs text-success">✓ Performance completed</span>)}
                    <button
                        onClick={onDelete}
                        className="btn btn-sm btn-error btn-outline"
                        disabled={loading}
                    >
                        🗑️ Delete
                    </button>
                </>)}
        </div>)
}

