import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import apiEndPoints from "../utils/apiEndPoints";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

export const UserCreditsContext = createContext();

export const UserCreditsProvider = ({ children}) => {
    const [credits, setCredits] = useState(5);
    const [loading, setLoading] = useState(false);
    const {getToken , isSignedIn} = useAuth();

    // Function to fetch user credits from the backend(User credits API)
    const fetchUserCredits = useCallback( async () => {
        if(!isSignedIn) {
            console.log("User not signed in, skipping credit fetch");
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();
            console.log("Fetching user credits with token:", token ? "Token exists" : "No token");
            
           const response = await axios.get(apiEndPoints.GET_CREDITS, { headers: { Authorization: `Bearer ${token}` } });
           console.log("Credits API response:", response.data);
           
           if(response.status === 200){
            // console.log("Setting credits to:", response.data.credits);
            setCredits(response.data.credits);
           }else{
            toast.error("Unable to fetch user credits.");
           }
        } catch (error) {
            console.error("Error fetching user credits:", error);
            console.error("Error response:", error.response?.data);
            
            // Handle 403 Forbidden - user profile may not be created yet
            if(error.response?.status === 403) {
                console.log("Profile not yet authorized. New user - using default credits.");
                setCredits(5); // Default credits for new users
            } else if(error.response?.status === 404) {
                console.log("User profile not found. Setting default credits.");
                setCredits(5);
            } else {
                toast.error("Unable to fetch user credits. Using default.");
                setCredits(5);
            }
        }
        finally {
            setLoading(false);
        }
    }, [getToken, isSignedIn]);
        

    useEffect( () => {
        if(isSignedIn)
        fetchUserCredits();
    }, [fetchUserCredits, isSignedIn]);

    const updateCredits = useCallback(newCredits => {
        console.log("Updating the credits", newCredits);
        setCredits(newCredits);
    }, []);

    const contextValue={
        credits,
        setCredits,
        fetchUserCredits,
        updateCredits
    }


    return (
        <UserCreditsContext.Provider value={contextValue}>

            {children}
        </UserCreditsContext.Provider>
    )
}