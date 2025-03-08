import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import routes from "tempo-routes";

// Pages
import Landing from "./pages/landing";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup";
import ChatbotSelection from "./pages/chatbot-selection";
import Documents from "./pages/documents";
import FirstAid from "./pages/first-aid";

// Chatbot Components
import MedicalChatbot from "./components/chat/MedicalChatbot";
import FirstAidChatbot from "./components/chat/FirstAidChatbot";
import FitnessChatbot from "./components/chat/FitnessChatbot";
import UserChatHistory from "./components/chat/UserChatHistory";

// Layout components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { Toaster } from "./components/ui/toaster";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

import SplashCursor from "./components/SplashCursor";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <div className="min-h-screen bg-background text-foreground">
          <SplashCursor />
          <div className="relative z-10">
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/first-aid" element={<FirstAid />} />
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <ChatbotSelection />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat/medical"
                element={
                  <PrivateRoute>
                    <div className="flex flex-col h-screen">
                      <MedicalChatbot />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat/firstaid"
                element={
                  <PrivateRoute>
                    <div className="flex flex-col h-screen">
                      <FirstAidChatbot />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat/fitness"
                element={
                  <PrivateRoute>
                    <div className="flex flex-col h-screen">
                      <FitnessChatbot />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat/history"
                element={
                  <PrivateRoute>
                    <UserChatHistory />
                  </PrivateRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <PrivateRoute>
                    <Documents />
                  </PrivateRoute>
                }
              />
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            <div className="hidden chat-pages:hidden">
              <Footer />
            </div>
            <Toaster />
          </div>
        </div>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
