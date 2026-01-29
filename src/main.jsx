import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react';


const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key')
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider 
    publishableKey={clerkPubKey}
    afterSignInUrl="/dashboard"
    afterSignUpUrl="/dashboard"
  >
    <App />
  </ClerkProvider>
)
