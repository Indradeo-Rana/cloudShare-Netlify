import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import SideMenu from "../components/SideMenu";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { retryAxiosCall } from "../utils/retryUtils";

const DashboardLayout = ({ children, activeMenu }) => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();

    // ✅ ENSURE PROFILE EXISTS IN MONGODB WITH RETRY LOGIC
    useEffect(() => {
        if (!isLoaded || !user) return;

        const ensureProfile = async () => {
            try {
                const token = await getToken();

                // Retry the API call up to 3 times with exponential backoff
                await retryAxiosCall(
                    () =>
                        axios.post(
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
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        ),
                    3,
                    1000
                );

                console.log("✅ User profile ensured successfully");
            } catch (error) {
                // If retries are exhausted, log error but don't break the app
                if (error.code === 'ERR_NETWORK') {
                    console.warn(
                        "⚠️ Backend is unreachable. User can still access dashboard with limited features."
                    );
                } else {
                    console.error("❌ Failed to ensure profile in DB:", error.message);
                }
                // Don't throw - allow dashboard to load even if profile setup fails
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
