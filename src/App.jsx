import { BrowserRouter, Route, Routes } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Subscription from "./pages/Subcription";
import Transactions from "./pages/Transactions";
import MyFiles from "./pages/MyFiles";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { UserCreditsProvider } from "./context/UserCreditsContext";
import PublicFileView from "./pages/PublicFileView";

const App = () => {
  return (
    // <div>App component</div>
    <UserCreditsProvider> {/* it is wrapped entire app so any page can read/update credits */}
      <BrowserRouter> {/*enable SPA */}
        <Toaster />  {/* display pop message */}
        <Routes> {/* holds all <route> definitions */}

          {/* it can be accessed by anyone (public) */}
          <Route path="/" element={<Landing />} />

          {/* Protected Route Pattern */}
          <Route
            path="/dashboard"
            element={
              <> {/* Fragment starts here because Route ele accepts only one parent so it groups multiple components */}
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          {/* <Route path="/upload" element={<Upload />} /> */}
          <Route
            path="/upload"
            element={
              <>
                <SignedIn>
                  <Upload />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          {/* <Route path="/my-files" element={<MyFiles />} /> */}
          <Route
            path="/my-files"
            element={
              <>
                <SignedIn>
                  <MyFiles />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          
          <Route
            path="/subscription"
            element={
              <>
                <SignedIn>
                  <Subscription />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/transactions"
            element={
              <>
                <SignedIn>
                  <Transactions />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="file/:fileId"
            element={
              <>
                <PublicFileView />
              </>
            }
          />
          <Route path="/*" element={<RedirectToSignIn />} />
        </Routes>
      </BrowserRouter>
    </UserCreditsProvider>
  );
};

export default App;
