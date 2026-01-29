import { useContext, useState,  } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import apiEndPoints from "../utils/apiEndPoints";
import UploadBox from "../components/UploadBox"

const Upload = () => {

    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success or error
    const auth = useAuth();
    const getToken = auth?.getToken;
    const {credits, updateCredits} = useContext(UserCreditsContext) || {};
    const MX_FILES = 5;
    // normalize credits so UI doesn't break if context is not ready
    const remainingCredits = typeof credits === "number" ? credits : Infinity;

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if(files.length + selectedFiles.length > MX_FILES){
            setMessage(`You can only upload a maximum of ${MX_FILES} files at once`);
            setMessageType("error");
            return;
        }

        // add the new files into the existing files
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        setMessage("");
        setMessageType("");
    }

    const handleRemoveFile = (index) =>{
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setMessage("");
        setMessageType("");
    }

    const handleUpload = async () => {
        if(files.length === 0){
            setMessageType('error');
            setMessage("Please select at least one file to upload.");
            return;
        }

        if(files.length > MX_FILES){
            setMessage(`You can only upload a maximum of ${MX_FILES} files at once.`);
            setMessageType("error");
            return;
        }

        setUploading(true);
        setMessage("Uploading files ...");
        setMessageType("info");

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        try {
            if (!getToken) {
                throw new Error("Authentication is not ready yet. Please sign in or wait for auth to initialize.");
            }
            const token = await getToken();
            const response = await axios.post(
                apiEndPoints.UPLOAD_FILE,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if(response.data && response.data.remainingCredits !== undefined){
                updateCredits(response.data.remainingCredits);
            }

            setMessage("Files uploaded successfully.");
            setMessageType("success");
            setFiles([]);

        } catch (error) {
            console.log("Error uploading files: ", error);
            
            setMessage(error.response?.data?.message || "Error uploading files. Please try again.");
            setMessageType("error");

        } finally {
            setUploading(false);
        }
    }

    const isUploadDisabled = files.length === 0 || files.length > MX_FILES || (typeof remainingCredits === "number" && remainingCredits <= 0) || (typeof remainingCredits === "number" && files.length > remainingCredits);



    return (
       <DashboardLayout activeMenu="Upload">
        <div className="p-6">
            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${messageType === 'error' ? 'bg-red-50 text-red-700' : messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                   { messageType === 'error' &&  <AlertCircle size={30} />}
                   {message}
                </div>
            )}

            <UploadBox
                files ={files}
                onFileChange={handleFileChange}
                onUpload={handleUpload}
                uploading={uploading}
                onRemoveFile={handleRemoveFile}
                remainingCredits={remainingCredits}
                isUploadDisabled ={isUploadDisabled}
            />

        </div>
       </DashboardLayout>
    )
}

export default Upload;