import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import routes from "tempo-routes";

// Pages
import Landing from "./pages/landing";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup";
import Chat from "./components/home";

// Layout components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

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
        <div className="min-h-screen bg-black text-white">
          <SplashCursor />
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Footer />
        </div>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
