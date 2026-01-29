import { Download, Trash2, Share2, Eye } from "lucide-react";
import { useState } from "react";

const RecentFiles = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (name) => {
    if (!name) return "📁";
    const ext = name.split(".").pop().toLowerCase();
    const icons = {
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      xls: "📊",
      xlsx: "📊",
      ppt: "🎯",
      pptx: "🎯",
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      gif: "🖼️",
      zip: "📦",
      rar: "📦",
      txt: "📄",
      mp4: "🎬",
      mp3: "🎵",
    };
    return icons[ext] || "📁";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Files</h2>

      {files.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No files uploaded yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Start by uploading files from the left panel
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition group"
            >
              {/* File Info */}
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">
                  {getFileIcon(file.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800 truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatFileSize(file.fileSize)}</span>
                    <span>{formatDate(file.uploadedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => setSelectedFile(file.id)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                  title="View file"
                >
                  <Eye size={18} />
                </button>
                <button
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                  title="Download file"
                >
                  <Download size={18} />
                </button>
                <button
                  className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition"
                  title="Share file"
                >
                  <Share2 size={18} />
                </button>
                <button
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                  title="Delete file"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {files.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Total Files: <span className="font-semibold">{files.length}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentFiles;
