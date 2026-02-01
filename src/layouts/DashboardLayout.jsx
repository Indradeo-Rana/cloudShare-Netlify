
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import SideMenu from "../components/SideMenu";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const DashboardLayout = ({ children, activeMenu }) => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();

    // ✅ ENSURE PROFILE EXISTS IN MONGODB
    useEffect(() => {
        if (!isLoaded || !user) return;

        const ensureProfile = async () => {
            try {
                const token = await getToken();
                await axios.post(
                    "https://cloudshare-api-production.up.railway.app/profile/ensure",
                    {
                        clerkId: user.id,
                        email: user.primaryEmailAddress?.emailAddress || "",
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        photoUrl: user.imageUrl || "",
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } catch (error) {
                console.error("Failed to ensure profile in DB", error);
            }
        };

        ensureProfile();
    }, [isLoaded, user, getToken]);

    return (
        <div>
            {/* Navbar component goes here */}
            <Navbar activeMenu={activeMenu} />

            {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                        {/* side menu */}
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                    <div className="grow max-5">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;
