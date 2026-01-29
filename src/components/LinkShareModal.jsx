import { useState } from 'react';
import { Copy, X } from 'lucide-react';
import toast from 'react-hot-toast';

const LinkShareModal = ({ isOpen, onClose, fileId, fileName }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const shareLink = `${window.location.origin}/file/${fileId}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

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
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Share Link</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    Share this link to let others view <span className="font-medium">{fileName}</span>
                </p>

                <div className="flex items-center gap-2 mb-6">
                    <input
                        type="text"
                        readOnly
                        value={shareLink}
                        className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 font-mono"
                    />
                    <button
                        onClick={handleCopyLink}
                        className={`p-2 rounded-md transition-colors ${
                            copied
                                ? 'bg-green-100 text-green-600'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                        title="Copy link"
                    >
                        <Copy size={18} />
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default LinkShareModal;