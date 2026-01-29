import { useState } from "react";
import {
  FileIcon,
  FileText,
  Music,
  Video,
  Image,
  Lock,
  Globe,
  Copy,
  Eye,
  Download,
  Trash2,
} from "lucide-react";

const FileCard = ({ file, onDownload, onDelete, onTogglePublic, onOpenDeleteConfirm, onOpenShareModal, onShareLink }) => {
  const [showActions, setShowActions] = useState(false);

  const getFileIcon = (file) => {
    if (!file || !file.name)
      return <FileIcon size={48} strokeWidth={2} className="text-gray-500" />;
    const extention = file.name.split(".").pop().toLowerCase();
    console.log("File extention:", extention);

    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extention)
    ) {
      return <Image size={48} strokeWidth={2} className="text-purple-500" />;
    }

    if (["mp4", "webm", "mov", "avi", "mvk"].includes(extention)) {
      return <Video size={48} strokeWidth={2} className="text-blue-500" />;
    }
    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extention)) {
      return <Music size={48} strokeWidth={2} className="text-green-500" />;
    }
    if (["pdf", "doc", "txt", "docx", "rtf"].includes(extention)) {
      return <FileText size={48} strokeWidth={2} className="text-amber-500" />;
    }
    return <FileIcon size={48} strokeWidth={2} className="text-red-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    // just for practice
    // <div className="flex items-center gap-2">
    //     {getFileIcon()}
    //     {/* {formatDate(file.uploadedAt)} */}
    //     {/* <span>{formatFileSize(file.size)}</span> */}
    // </div>

    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className="relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-300"
    >
      <div className="h-32 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
        {getFileIcon(file)}
      </div>

        {/* public/private badage */}
        <div className="absolute top-2 right-2">
          <div
            className={`rounded-full p-1.5 ${file.isPublic ? 'bg-green-100': 'bg-gray-100'}`}
            title={file.isPublic ? "Public" : "Private"}
          >
            {file.isPublic ? (
              <Globe size={14} className="text-green-600" />
            ) : (
              <Lock size={14} className="text-amber-600" />
            )}
          </div> 
        </div>
      
      {/* file details */}
      <div className="p-4">
        <h3 title={file.name} className="font-medium text-gray-900 truncate">
          {file.name}
        </h3>
        <p className="text-xs text-gray-500 mt-2">
          {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
        </p>
      </div>

      {/* action buttons */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center p-4 transition-opacity duration-300 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex gap-3 w-full justify-center">

          {/* sharing link method */}
          {file.isPublic && onShareLink && (
          <button
            onClick={() => onShareLink(file.id)}
            title="Share Link"
            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-purple-500 hover:text-purple-600">
            <Copy size={16} />
          </button>
          )}

          {/* file is public or not */}
          {file.isPublic && (
            <a
              href={`/file/${file.id}`}
              title="View File"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-gray-700 hover:text-gray-900"
            >
              <Eye size={16} />
            </a>
          )}

          {/* make public/private file method */}
          <button
            onClick={() => onTogglePublic(file)}
            title={file.isPublic ? "Make Private" : "Make Public"}
            className="p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-amber-600 hover:text-amber-700">
            {file.isPublic ? <Lock size={18} /> : <Globe size={18} />}
          </button>

          {/* download method */}
          <button
            onClick={() => onDownload(file)}
            title="Download"
            className="p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-green-600 hover:text-green-700">
            <Download size={16} />
          </button>
          
          {/* Delete method */}
          <button
            onClick={() => onDelete(file.id)}
            title="Delete"
            className="p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-red-600 hover:text-red-700">
            <Trash2 size={16} />
          </button>
        </div>
      </div>



    </div>
  );
};

export default FileCard;
