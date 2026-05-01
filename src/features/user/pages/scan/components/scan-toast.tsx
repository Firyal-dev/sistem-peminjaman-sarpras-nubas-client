interface ScanToastProps {
    message: string | null
    type: "success" | "warning" | null
}

export const ScanToast = ({ message, type }: ScanToastProps) => {
    if (!message || !type) return null

    const styles = {
        success: "bg-green-100 text-green-700 border-green-200",
        warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    }

    return (
        <div className={`rounded-lg border px-3 py-2 text-center text-sm ${styles[type]}`}>
            {message}
        </div>
    )
}
