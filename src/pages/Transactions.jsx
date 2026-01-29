import { useAuth } from "@clerk/clerk-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect,useState } from "react";
import { AlertCircle, Loader2, Receipt } from "lucide-react";
import axios from "axios";
import apiEndPoints from "../utils/apiEndPoints";


const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const {getToken, isSignedIn} = useAuth();

    useEffect( () => {
        const fetchTransations = async() =>{
            if(!isSignedIn) return;
            
            try{
                setLoading(true);
                const token = await getToken();
                
                if(!token) {
                    setError("Authentication required. Please sign in.");
                    return;
                }
                
                const response = await axios.get(apiEndPoints.TRANSACTIONS, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }); 
                setTransactions(response.data);
                setError(null)
            }catch(error){
                    console.log("Error fetching transaction history. Please try again later.", error);
                    setError("Error fetching transaction history. Please try again later.");
            }
            finally{
                setLoading(false);
            }
        };
        fetchTransations();
    }, [getToken, isSignedIn]);

    
    //to format date in human readable form
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
        };

    // format amount from paisa to rupees
    const formatAmount = (amountInPaisa) => {
        return (amountInPaisa / 100).toFixed(2);
    };


    return (
        <DashboardLayout    activeMenu="Transactions">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Receipt className="text-blue-600" size={24} />
                    <h1 className="text-2xl font-bold">Transaction History</h1>
                </div>

                {error && (
                    <div className="text-red-600 mb-6 m-4 bg-red-50 rounded-lg flex items-center gap-2 p-4 ">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-65">
                        <Loader2 className="animate-spin mr-2" size={24} />
                        <span>Loading transactions...</span>
                    </div>
                ) : transactions.length ===0 ? (
                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                        <Receipt size={48} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                            No Transactions Yet
                        </h3>
                        <p className="text-gray-500">
                            You haven't made any credits purchases yet. Visit the Subscription page to buy credits.
                        </p>
                    </div>
                ): (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                            <thead className="bg-gray-50">
                                <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits Added</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Id</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {transactions.map( (transaction) => (
                                    <tr key= {transaction.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(transaction.transactionDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                        {transaction.planId === "premium"
                                        ? "Premium Plan"
                                        : transaction.planId === "ultimate"
                                        ?" Ultimate Plan"
                                        :"Basic Plan"}
                                        
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹ {formatAmount(transaction.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {transaction.creditsAdded}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                        {transaction.paymentId
                                        ? transaction.paymentId.substring(0,10) + "..."
                                        : "N/A"}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                    
            </div>
        </DashboardLayout>
    )
}

export default Transactions;