const ConfirmationDialog = ({
    isOpen,
    onClose,
    title = "Confirm Action",
    message = "Are you sure to proceed",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    confirmationButtonClass = "bg-red-600 hover:bg-red-700",
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose?.();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={handleBackdropClick}
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="mt-3 text-gray-600">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-md text-white ${confirmationButtonClass}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;