import React, { useRef, useState } from "react";

const UploadBox = ({
    title = "Upload files",
    accept = "*/*",
    multiple = false,
    className = "",
    files = [],
    onFileChange,
    onFiles,
    onUpload,
    uploading = false,
    onRemoveFile,
    remainingCredits = Infinity,
    isUploadDisabled = false,
    disabled = false
}) => {
    const inputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const handleInputChange = (e) => {
        onFileChange?.(e);
        if (onFiles) onFiles(Array.from(e.target.files));
    };

    const handleRemove = (index) => {
        onRemoveFile?.(index);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (disabled) return;
        const dropped = Array.from(e.dataTransfer.files || []);
        if (dropped.length === 0) return;
        if (onFiles) onFiles(dropped);
        // also build a synthetic event for backward compatibility if consumer expects an event
        const fakeEvent = { target: { files: dropped } };
        onFileChange?.(fakeEvent);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    return (
        <div className={`border rounded-lg p-6 ${className}`}>
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="text-lg font-medium">{title}</h2>
                <div className="text-sm text-gray-600">Remaining Credits: <span className="font-semibold">{remainingCredits}</span></div>
            </div>

            <label
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`w-full cursor-pointer block mb-4 p-6 border-2 border-dashed rounded text-center ${disabled ? "opacity-50 cursor-not-allowed" : dragActive ? "bg-gray-50 border-gray-400" : "hover:border-gray-400"}`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={handleInputChange}
                    className="hidden"
                />
                <div className="text-gray-600">Click to select files or drag them here</div>
                <div className="text-sm text-gray-400 mt-2">Accepted: {accept} {multiple ? " • Multiple files allowed" : ""}</div>
            </label>

            {files && files.length > 0 && (
                <div className="mb-4">
                    <ul className="space-y-2">
                        {files.map((file, idx) => (
                            <li key={idx} className="flex items-center justify-between p-2 border rounded">
                                <div className="text-sm truncate">{file.name}</div>
                                <div className="flex items-center gap-2">
                                    <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                    <button type="button" onClick={() => handleRemove(idx)} className="text-sm text-red-500 hover:underline">Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex items-center gap-3">
                <button
                    onClick={onUpload}
                    disabled={isUploadDisabled || uploading || disabled}
                    className={`px-4 py-2 rounded ${isUploadDisabled || uploading || disabled ? "bg-gray-300 text-gray-700" : "bg-purple-500 text-white hover:bg-purple-600"}`}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
                <div className="text-sm text-gray-500">{files.length} file(s)</div>
            </div>
        </div>
    );
};

export default UploadBox;

UploadBox.modes = {
    DASHBOARD: "dashboard",
    UPLOAD: "upload"
};

UploadBox.defaultProps = {
    mode: UploadBox.modes.UPLOAD,
    title: "Upload files",
    accept: "*/*",
    multiple: false,
    onFiles: undefined,
    onFileChange: undefined,
    onUpload: undefined,
    uploading: false,
    disabled: false,
    className: ""
};

export const DashboardUploadBox = (props) => <UploadBox mode={UploadBox.modes.DASHBOARD} {...props} />;
export const SimpleUploadBox = (props) => <UploadBox mode={UploadBox.modes.UPLOAD} {...props} />;