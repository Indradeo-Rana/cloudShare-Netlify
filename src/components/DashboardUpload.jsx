import { Upload, UploadIcon, X } from "lucide-react";

const DashboardUpload = ({
  onFileChange,
  onUpload,
  uploadFiles,
  onRemoveFile,
  uploading,
  remainingUploads,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
        
      <h2 className="text-xl font-semibold mb-4">Upload Files </h2>

      {/* Upload Box */}
      <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center bg-purple-50 cursor-pointer hover:border-purple-500 transition">
        <label htmlFor="file-input" className="cursor-pointer">
          <Upload className="mx-auto text-purple-500 mb-3" size={40} />
          <p className="text-gray-700 font-medium">Drag and drop your files here</p>
          <p className="text-gray-500 text-sm">or click to select files</p>
          <p className="text-xs text-gray-400 mt-2">
            Maximum {remainingUploads} file(s) remaining
          </p>
          <input
            id="file-input"
            type="file"
            multiple
            onChange={onFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Selected Files List */}
      {uploadFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-3">
            Selected Files ({uploadFiles.length}/{5})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uploadFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => onRemoveFile(index)}
                  disabled={uploading}
                  className="ml-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                  title="Remove file"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={onUpload}
        disabled={uploading || uploadFiles.length === 0}
        className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        <Upload size={20} />
        {uploading ? "Uploading..." : "Upload Files"}
      </button>

      {/* Info */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        Maximum 5 files at a time • Max file size: 100MB
      </p>
    </div>
  );
};

export default DashboardUpload;
