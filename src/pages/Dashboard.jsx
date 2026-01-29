import { useAuth, UserButton } from "@clerk/clerk-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { apiEndPoints } from "../utils/apiEndPoints";
import DashboardUpload from "../components/DashboardUpload";
import RecentFiles from "../components/RecentFiles";
import { UserCreditsContext } from "../context/UserCreditsContext";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [remainingUploads, setRemainingUploads] = useState(5);
  const {getToken} = useAuth();

  const {fetchUserCredits} = useContext(UserCreditsContext);
  const MX_FILES=5;

  useEffect( () => {
    const fetchRecentFile = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        // use the existing endpoint that we have works
        const res = await  axios.get(apiEndPoints.FETCH_FILES, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        console.log("token :",token);

        // sort by uploadedAt descending and take only 5 most recent files
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        const sortedFiles = list
          .slice() // avoid mutating original
          .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
          .slice(0, 5);
        setFiles(sortedFiles);
        
      } catch (error) {
        console.error("Error fetching recent files:", error);
        
        // Handle 403 Forbidden - new user profile not yet fully set up
        if(error.response?.status === 403) {
          console.log("Profile not yet authorized for file access. New user.");
          setFiles([]);
        } else if(error.response?.status === 404) {
          console.log("No files found.");
          setFiles([]);
        } else {
          console.error("Error fetching files:", error.message);
          setFiles([]);
        }
      }finally{
        setLoading(false);
      }
    };
    fetchRecentFile();
  }, [getToken]);


// handle file change
const handleFileChange = (e) => {
  const selectdFiles = Array.from(e.target.files);

   // check if adding these files exceeds the limit
   if(uploadFiles.length + selectdFiles.length > MX_FILES){
    setMessageType("error");
    setMessage(`You can upload maximum ${MX_FILES} files at a time.`);
    return;
   }

   //add the new files to the existing files
   setUploadFiles( (prevFiles) => [...prevFiles, ...selectdFiles]);
   setMessage("");
   setMessageType("info");
};

 // handle remove file from upload list
const handleRemoveFile = (index) => {
  setUploadFiles( (prevFiles) => prevFiles.filter( (_, i) => i !== index));
  setMessage("");
  setMessageType("info");
};

// calculate the remaining uploads
useEffect( () => {
  setRemainingUploads(MX_FILES - uploadFiles.length);
}, [uploadFiles]);

// handle file upload
const handleUpload = async () => {
  if(uploadFiles.length ===0){
    setMessage("Please select atleast 1 file to upload.");
    setMessageType("error");
    return;
  }

  if(uploadFiles.length > MX_FILES){
    setMessage(`You can upload maximum ${MX_FILES} files at a time.`);
    setMessageType("error");
    return;
  }

  setUploading(true);
  setMessage("Uploading files ...");
  setMessageType("info");

  const formData = new FormData();
  uploadFiles.forEach( (file) => formData.append("files", file));

  try {
    const token = await getToken();
    const response = await axios.post(apiEndPoints.UPLOAD_FILE, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    setMessage("Files uploaded successfully!");
    setMessageType("success");
    setUploadFiles([]);

    // refresh the recent files list
    const res = await axios.get(apiEndPoints.FETCH_FILES, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    // sort by uploadedAt and take only 5 most recent files
    const list = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.data)
      ? res.data.data
      : [];
    const sortedFiles = list
      .slice()
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .slice(0, 5);
    setFiles(sortedFiles);

    // refresh user credits immediately after  successful upload
    await fetchUserCredits();
  } catch (error) {
    console.error("Error uploading files:", error);
    setMessage(error.response?.data?.message || "Error uploading files. Please try again.");
    setMessageType("error");
  }
  finally{
    setUploading(false);
  }
};

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="p-4">
        {/* <UserButton /> */}
        {/* Dashboard Content */}
        <h1 className="text-2xl font-bold mb-6">My Drive</h1>
        <p className="text-gray-600 mb-6">Upload, Manage, and Share your files.</p>
        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-3 ${messageType === "error" ? "bg-red-200 text-red-800" : messageType === "success" ? "bg-green-200 text-green-800" : "bg-blue-200 text-blue-800"}`}>
            {message}
      </div>
        )}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column */}
          <div className="w-full md:w-[40%">
            <DashboardUpload
              files={files}
              onFileChange={handleFileChange}
              onUpload={handleUpload}
              uploadFiles={uploadFiles}
              onRemoveFile={handleRemoveFile}
              uploading={uploading}
              remainingUploads={remainingUploads}
            />
          </div>

          {/* Right column */}
           <div className="w-full md:w-[60%">
            {loading ? (
              <div className="bg-white rounded-lg shadow p-6 flex flex-items-center justify-center">
                <Loader2 size={40} className="text-purple-500 animate-spin" />
                <p className="text-gray-500">Loading your files ...</p>
              </div>
            ): (
              <RecentFiles files={files} />
            )}
           </div>

        </div>
          </div>
    </DashboardLayout>
  );
};

export default Dashboard;
