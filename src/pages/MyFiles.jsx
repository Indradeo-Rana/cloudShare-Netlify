import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { List, Grid, File, Copy, Lock, Download , Globe, Trash2 , Eye, Image, Video, Music, FileText} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useNavigate as useNavitate, Link } from 'react-router-dom';
import FileCard from '../components/FileCard';
import { FileIcon } from 'lucide-react';
import apiEndpoints from '../utils/apiEndPoints'
import ConfirmationDialog from '../components/ConfirmationDialog';
import LinkShareModal from '../components/LinkShareModal';

const MyFiles = () => {

    const [files, setFiles] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
    const {getToken} = useAuth();
    const navigate = useNavitate();
    const [deleteConfirmation, setDeleteConfirmation] = useState({isOpen: false, fileId: null});
    const [shareModal, setShareModal] = useState({isOpen: false, fileId: null, link: ''});

    // fetching the files for a logged in user
    const fetchFiles = async () => {
        try {
            const token = await getToken();
           const response = await axios.get(apiEndpoints.FETCH_FILES, {headers: {Authorization: `Bearer ${token}`}});
            
           if(response.status === 200) {
            // console.log("fetched: " , response.data);
                setFiles(response.data);
           }    
        }catch(error) {
            console.error("Error fetching files:", error);
            toast.error("Failed to load files.");
        }
    }

    // toggles the public and private status of a file
    const togglePublic =async(fileToUpdate) => {
        try{
            const token= await getToken();
            await axios.patch(apiEndpoints.TOGGLE_FILE(fileToUpdate.id), {}, {headers:
            {Authorization: `Bearer ${token}`}});

            setFiles(files.map((file) => file.id === fileToUpdate.id ? {...file, isPublic: !file.isPublic} : file));
        }catch(error){
            console.error("Error toggling file status", error);
            toast.error("Error toggling file status " + error.message);
        }
    }

    //  Handle file download
    const handleDownload = async(file) => {
        try{
            const token = await getToken();
            const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(file.id), 
                {
                    headers: {Authorization: `Bearer ${token}`},
                    responseType: 'blob'
                }
            )
            // create a blob url and trigger download
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        }catch(error){
            console.error("Download fail:", error);
            toast.error("Failed to download file. " + error.message);
        }
    }

    //  closes the delete confirmation dialog handlers
    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({isOpen: false, fileId: null});
    }

    // opens the delete confirmation modal
    const openDeleteConfirmation = (fileId) => {
        setDeleteConfirmation({isOpen: true, fileId});
    }

    // delete the after confirmed file
    const handleDelete = async () => {
        if (!deleteConfirmation.fileId) return;
        try {
            const token = await getToken();
            await axios.delete(
                apiEndpoints.DELETE_FILE(deleteConfirmation.fileId),
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFiles((prev) => prev.filter((f) => f.id !== deleteConfirmation.fileId));
            toast.success('File deleted successfully');
        } catch (error) {
            console.error('Error deleting file:', error);
            toast.error('Failed to delete file. ' + error.message);
        } finally {
            closeDeleteConfirmation();
        }
    }

    // opens the share link modal
    const openShareModal = (fileId) => {
        const link = `${window.location.origin}/file/${fileId}`;
        setShareModal({isOpen: true, fileId, link});
    }

    // close the share link modal
    const closeShareModal = () => {
        setShareModal({isOpen: false, fileId: null, link: ''});
    }   

    useEffect(() => {
        fetchFiles();
    }, [getToken]);

    const getFileIcon = (file) => {
    if (!file || !file.name)
      return <FileIcon size={24} className="text-gray-500" />;
    const extention = file.name.split(".").pop().toLowerCase();
    // console.log("File extention:", extention);

    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extention)
    ) {
      return <Image size={24} className="text-purple-500" />;
    }

    if (["mp4", "webm", "mov", "avi", "mvk"].includes(extention)) {
      return <Video size={24} className="text-blue-500" />;
    }
    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extention)) {
      return <Music size={24} className="text-green-500" />;
    }
    if (["pdf", "doc", "txt", "docx", "rtf"].includes(extention)) {
      return <FileText size={24} className="text-amber-500" />;
    }
    return <FileIcon size={24} className="text-red-500" />;
  };

    return (
         <DashboardLayout activeMenu="My Files">
            <div className="p-6">   
                <div className="mb-4 flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">My Files {files.length}</h2>
                    <div className="flex items-center gap-3" 
                    onClick={(e) => e.stopPropagation()}
                    >
                        <List 
                            onClick={() => setViewMode('list')}
                            size={24}
                            className={`cursor-pointer transition-color ${viewMode === 'list' ? 'text-blue-600': 'text-gray-400 hover:text-gray-600 '}`}/>
                        <Grid 
                            onClick={() => setViewMode('grid')}
                            size={24}
                            className={`cursor-pointer transition-color ${viewMode === 'grid' ? 'text-blue-600': 'text-gray-400 hover:text-gray-600 '}`}/>
                    </div>
                </div>

                {files.length == 0 ? (
                    <div className="bg-white rounded-lg shadow p-2 flex flex-col items-center justify-center">
                        <File
                            size={55}
                            className='text-purple-500 mb-4'
                        />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                            No files uploaded yet.
                        </h3>
                        <p className="text-gray-500 text-center max-w-md mb-6">
                            Start uploading files to see them listed here. You can easily manage and share your files from this dashboard with ease.
                        </p>
                        <button 
                        onClick={() => navigate('/upload')}
                        className='px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-650 transition-colors'>
                            Go to Upload
                        </button>
                    </div>
                ) :viewMode ==="grid" ? (
                    // <div>grid view</div> // pass the props in FileCard component
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {files.map((file) => (
                        <FileCard 
                            key={file.id}
                            file={file}
                            onDownload={handleDownload}
                            onDelete={openDeleteConfirmation}
                            onTogglePublic={togglePublic}
                            onShareLink={openShareModal}
                            // onOpenDeleteConfirm={openDeleteConfirmation}
                            // onOpenShareModal={(fileId, fileName) => setShareModal({isOpen: true, fileId, fileName})}
                        />
                        ))}
                    </div>
                ) : (
     // <div>list view</div>
                   <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sharing</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                            {files.map((file) => (
                                <tr key={file.id} className='hover:bg-gray-50 transition-colors'>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                        <div className='flex items-center gap-2'>
                                            {/* <File size={16} className='text-blue-400'/> */}
                                            {getFileIcon(file)}
                                            {file.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap ext-sm text-gray-600">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap ext-sm text-gray-600">
                                        {new Date(file.uploadedAt).toLocaleDateString()} 
                                    </td>
                                     <td className="flex items-center justify-center mt-3 gap-3">
                                         <div className='grid grid-cols-3 '>
                                        <button
                                        onClick={()=> togglePublic(file)}
                                         className="flex items-center gap-2 cursor-pointer group">
                                            {file.isPublic ?(
                                                <>  
                                                <Globe size={16} className="text-green-500 group-hover:text-green-700"/>
                                                <span className='group-hover:underline'>Public</span>
                                                </>
                                            ): (
                                                <>
                                                <Lock size={16} className="text-red-500 group-hover:text-red-700"/>
                                                <span className='group-hover:underline'>Private</span>
                                                </>
                                            )}
                                        </button>
                                        {file.isPublic && (
                                            <button 
                                                onClick={ () => openShareModal(file.id)}
                                                className='flex items-center gap-2 cursor-pointer group text-blue-600'>
                                                <Copy size={16}/>
                                                <span className='group-hover:underline'>Share Link</span>
                                            </button>
                                        )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className='grid grid-cols-3 gap-4'>
                                            <div className='flex justify-center'>
                                                <button
                                                onClick={() => handleDownload(file)}
                                                title="Download" 
                                                className='text-gray-500 hover:text-blue-600'>
                                                    <Download size={18}/>
                                                </button>
                                            </div>
                                            <div className="flex justify-center">
                                                <button 
                                                title="Delete"
                                                onClick={() => openDeleteConfirmation(file.id)}
                                                className="text-gray-500 hover:text-red-600">
                                                    <Trash2 size={18}/>
                                                </button>
                                            </div>
                                            <div className="flex justify-center">
                                                {file.isPublic ? (
                                                    <a href={`/file/${file.id}`} title='View File' target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-600">
                                                        <Eye size={18} />
                                                    </a>
                                                ):(
                                                    <span className="w-[18px]"></span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                   </div>
                )}
                {/* Delete confirmation dialog */}
                <ConfirmationDialog
                    isOpen={deleteConfirmation.isOpen}
                    onClose={closeDeleteConfirmation}
                    title="Delete File"
                    message="Are you sure you want to delete this file? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleDelete}
                    confirmationButtonClass="bg-red-600 hover:bg-red-700"
                />

                {/* Share link modal */}
                <LinkShareModal
                    isOpen={shareModal.isOpen}
                    onClose={() => setShareModal({isOpen: false, fileId: null, fileName: ''})}
                    fileId={shareModal.fileId}
                    fileName={shareModal.fileName}
                />
            </div>
        
       </DashboardLayout>
        
    )
}

export default MyFiles;