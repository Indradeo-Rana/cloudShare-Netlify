
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiEndPoints = {
    FETCH_FILES: `${BASE_URL}/files/my`,
    GET_CREDITS: `${BASE_URL}/users/credits`,
    TOGGLE_FILE:(id) => `${BASE_URL}/files/${id}/toggle-public`,
    DELETE_FILE:(id) => `${BASE_URL}/files/${id}`,
    UPLOAD_FILE: `${BASE_URL}/files/upload`,
    CREATE_ORDER: `${BASE_URL}/payments/create-order`,
    VERIFY_PAYMENT: `${BASE_URL}/payments/verify-payment`,
    TRANSACTIONS: `${BASE_URL}/transaction`,
    PUBLIC_FILE_VIEW:(fileId) => `${BASE_URL}/files/public/${fileId}`,
    DOWNLOAD_FILE:(fileId)=>`${BASE_URL}/files/download/${fileId}`,
}

export default apiEndPoints;