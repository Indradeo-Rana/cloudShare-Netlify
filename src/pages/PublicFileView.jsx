import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Copy, Download, File, Info, Share2 } from "lucide-react";

import apiEndPoints from "../utils/apiEndPoints";
import LinkShareModal from "../components/LinkShareModal";

const PublicFileView = () => {

    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [shareModal, setShareModal] = useState({
        isOpen: false,
        link: ""
    });

    const { getToken } = useAuth();
    const { fileId } = useParams();

    useEffect(() => {
        const getFile = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(
                    apiEndPoints.PUBLIC_FILE_VIEW(fileId)
                );
                setFile(res.data);
                setError(null);
            } catch (err) {
                console.log("Error fetching file: ", err);
                setError("Could not retrieve file. The link may be invalid or the file may have been removed.");
            } finally {
                setIsLoading(false);
            }
        };
        getFile();
    }, [fileId, getToken]);

    // download the file
    const handleDownload = async () => {
        try {
            const response = await axios.get(
                apiEndPoints.DOWNLOAD_FILE(fileId),
                {
                    responseType: "blob",
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.log("Download failed: ", err);
            toast.error("Sorry, the file could not be downloaded.");
        }
    };

    const openShareModal = () => {
        setShareModal({
            isOpen: true,
            link: window.location.href,
        });
    };

    const closeShareModal = () => {
        setShareModal({
            isOpen: false,
            link: "",
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-600">Loading file...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <h2 className="text-xl font-semibold text-red-600">Error</h2>
                <p className="text-gray-600 mt-2">{error}</p>
            </div>
        );
    }

    if (!file) return null;

    return (
        <DashboardLayout activeMenu="">
            <div className="bg-gray-50 min-h-screen">
                <header className="p-4 border-b bg-white">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Share2 className="text-blue-600" size={24} />
                            <span className="font-bold text-xl">CloudShare</span>
                        </div>
                        <button
                            onClick={openShareModal}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg"
                        >
                            <Copy size={16} />
                            Share Link
                        </button>
                    </div>
                </header>

                {/* main content */}
                <main className="container mx-auto p-4 md:p-8 flex justify-center">
                    <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-center mb-4">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <File className="text-blue-600" size={40} />
                            </div>
                        </div>

                        <h1 className="text-2xl font-semibold text-gray-800 break-words text-center">
                            {file.name}
                        </h1>

                        <p className="text-sm text-gray-500 mt-2 text-center">
                            {(file.size / 1024).toFixed(2)} KB
                            <span className="mx-2">•</span>
                            Shared on {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>

                        <div className="my-6 text-center">
                            <span className="inline-block bg-gray-100 text-gray-600 text-sm font-medium py-1 px-3 rounded-lg">
                                {file.type || "File"}
                            </span>
                        </div>

                        <div className="flex justify-center gap-4 my-8">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg"
                            >
                                <Download size={16} />
                                Download File
                            </button>
                        </div>

                        <div className="text-left text-sm space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">File Name:</span>
                                <span className="text-gray-800 font-medium break-all">{file.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">File Size:</span>
                                <span className="text-gray-800 font-medium">
                                    {(file.size / 1024).toFixed(2)} KB
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Shared:</span>
                                <span className="text-gray-800 font-medium">
                                    {new Date(file.uploadedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-start gap-2">
                            <Info size={20} />
                            <p className="text-sm">
                                This file has been shared publicly. Anyone with the link can view and download the file.
                            </p>
                        </div>
                    </div>
                </main>

                {/* Share Modal */}
                <LinkShareModal
                    isOpen={shareModal.isOpen}
                    onClose={closeShareModal}
                    link={shareModal.link}
                    title="Share File Link"
                />
            </div>
        </DashboardLayout>
    );
};

export default PublicFileView;
