import { useEffect, useContext, useRef, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { features } from "../assets/data";
import { AlertCircle, Check, CreditCard, Currency, Loader2 } from "lucide-react";
import { usePlans } from "@clerk/clerk-react/experimental";
import { useAuth, useUser } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import axios from "axios";
import apiEndPoints from "../utils/apiEndPoints";

const Subscription = () => {

    const [processingPayment, setProcessingPayment] = useState(false);
    const [processingPlanId, setProcessingPlanId] = useState(null);

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
            /* ensure each plan card stretches so the button sits at the bottom */
            .grid > div {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success or error
    const [razorpayLoaded , setRazorpayLoaded] = useState(false);

    const {getToken} = useAuth();
    const razorpayScriptRef  = useRef(null);
    const {credits, updateCredits, fetchUserCredits} = useContext(UserCreditsContext);

    const {user} = useUser();

    // plans data
    const plans = [
        {
            id:"premium",
            name:"Premium",
            credits: 500,
            price: 500, 
            features: [
                "Upload up to 500 files",
                "Access to all premium features",
                "Priority customer support"
            ],
            recommended: false
        },
        {
            id:"ultimate",
            name:"Ultimate",
            credits: 5000,
            price: 2500, 
            features: [
                "Upload up to 5000 files",
                "Access to all premium features",
                "Priority customer support",
                "Exclusive Ultimate member benefits",
                "Advanced analytics and reporting"
            ],
            recommended: true
        }
    ];

    // load Razorpay script
    useEffect(() => {
        if(!window.Razorpay) {
            const script=document.createElement("script");
            script.src="https://checkout.razorpay.com/v1/checkout.js";
            script.async=true;
            script.onload = () => {
                console.log("Razorpay script loaded successfully");
                setRazorpayLoaded(true);
            };
            script.onerror = () => {
                console.error("Failed to load Razorpay script");
                setMessage("Failed to load payment gateway. Please try again later.");
                setMessageType("error");
            };
            document.body.appendChild(script);
            razorpayScriptRef.current = script;
               
        }else{
            setRazorpayLoaded(true);
        }
        return () => {
            // cleanup the script when component unmounts
            if(razorpayScriptRef.current){
                document.body.removeChild(razorpayScriptRef.current);
            }
        };
       
    }, []);

    // Credits are automatically fetched by UserCreditsContext on mount

    // handle purchase plan
    const handlePurchase = async (plan) => {
        if (!razorpayLoaded) {
            setMessage("Payment gateway is not loaded yet. Please try again later.");
            setMessageType("error");
            return;
        }
        setProcessingPayment(true);
        setProcessingPlanId(plan.id);
        setMessage("");

        try {
            const token = await getToken();
            // Create order on the backend
            const orderResponse = await axios.post(
                apiEndPoints.CREATE_ORDER,
                {
                    planId: plan.id,
                    amount: plan.price * 100, // amount in paise
                    currency: "INR",
                    credits: plan.credits
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: plan.price * 100,
                currency: "INR",
                name: "CloudShare",
                description: `Purchase ${plan.credits} credits`,
                order_id: orderResponse.data.orderId,
                handler: async (response) => {
                    // Verify payment on the backend
                    try {
                        const verifyResponse = await axios.post(
                            apiEndPoints.VERIFY_PAYMENT,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                planId: plan.id 
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json"
                                }
                            }
                        );

                        if (verifyResponse.data.success) {
                            if (verifyResponse.data.credits) {
                                console.log("updating credits to:", verifyResponse.data.credits);
                                updateCredits(verifyResponse.data.credits);
                            } else {
                                // if credits not updated properly, fetch the latest credits
                                console.log("Credits not in response, fetching latest credits");
                                await fetchUserCredits();
                            }
                            setMessage("Payment successful! Credits have been added to your account.");
                            setMessageType("success");
                } else {
                            setMessage("Payment verification failed. Please contact support.");
                            setMessageType("error");
                        }
                    } catch (error) {
                        console.log("Payment verification error:", error);
                        setMessage("Payment verification failed. Please contact support.");
                        setMessageType("error");
                    } finally {
                        setProcessingPlanId(null);
                    }
                },
                prefill: {
                    // You can prefill user details here if available
                    name: user.fullName,
                    email: user.primaryEmailAddress
                },
                theme: {
                    color: "#6b21a8" // Purple color
                }
            };

            if (window.Razorpay) {
                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else {
                throw new Error("Razorpay SDK not loaded");
            }
        } catch (error) {
            console.log("Payment initiation error:", error);
            setMessage("Failed to initiate payment. Please try again later.");
            setMessageType("error");
        } finally {
            setProcessingPayment(false);
            setProcessingPlanId(null);
        }
    };

    return (
        <DashboardLayout activeMenu="Subscription">
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Subscription Plans</h1>
            <p className="text-gray-600 mb-6" > Choose a plan that works for you</p>

            {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                messageType === 'error' ? 'bg-red-50 text-red-700' :
                messageType === 'success' ? 'bg-green-50 text-green-700' :
                ''
            }`}>
                {messageType === 'error' && <AlertCircle size={20} />}
                {message}
            </div>
    )}


        <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="text-purple-500" />
                    <h2 className="text-lg font-medium">Current Credits: <span className="font-bold text-purple-500">{credits}</span></h2>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                    You can upload {credits} more files with your current credits.
                </p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
                <div key={plan.id} 
                className={`border rounded-xl p-6  ${
                    plan.recommended 
                    ? 'border-purple-200 bg-purple-50 shadow-md' 
                    : 'border-gray-300 bg-white'
                }`}
                >
                    {plan.recommended && (
                        <div className="text-sm text-purple-600 font-medium mb-2">Recommended</div>
                    )}

                    <h1 className="text-xl font-bold">{plan.name}</h1>
                    <div className="mt-2 mb-4">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-gray-500 ml-2">for {plan.credits} credits</span>
                    </div>

                    <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handlePurchase(plan)}
                        disabled={processingPlanId === plan.id}
                        className={`w-full py-2 rounded-md font-medium transition-colors ${
                            plan.recommended
                            ? "bg-purple-500 text-white hover:bg-purple-600"
                            : "bg-white border border-purple-500  text-purple-500 hover:bg-gray-300"
                        } disabled:opacity-50 flex items-center justify-center gap-2`}
                        >
                        {processingPlanId === plan.id ? (
                            <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Processing...</span>
                            </>
                        ) :(
                            <span>Purchase Plan</span>
                        )}
                        </button>
                    </div>
            ))}
            </div>

            <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">
                    How credits work?
                </h3>
                <p className="text-gray-600 text-sm">
                    Each credit allows you to upload one file to your account. When you purchase a subscription plan,
                     your credits will be added to your account balance. You can use these credits to upload files 
                     as needed. Keep track of your credits to ensure you have enough for your uploads!
                </p>
            </div>
        </div>
        </DashboardLayout>
    )
}

export default Subscription;