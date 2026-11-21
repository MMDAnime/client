import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PageTitle from "./components/PageTitle";

import HomePage from "./pages/HomePage";
import AnimeListPage from "./pages/AnimeListPage";
import AnimeDetailPage from "./pages/AnimeDetailPage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import FavoritePage from "./pages/FavoritePage";
import AddAnimePage from "./pages/AddAnimePage";
import EditAnimePage from "./pages/EditAnimePage";
import NotFoundPage from "./pages/NotFoundPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const hideFooter = location.pathname === "/add-anime";

  return (
    <div className="app-shell min-h-screen text-white">
      <PageTitle />

      {!isAuthPage && <div className="global-background" aria-hidden="true" />}

      <div className={`app-content ${isAuthPage ? "auth-layout" : ""}`}>
        {!isAuthPage && <Header />}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime" element={<AnimeListPage />} />
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
          <Route path="/watch/:animeId/:episodeId" element={<VideoPlayerPage />} />
          <Route path="/favorites" element={<FavoritePage />} />
          <Route path="/add-anime" element={<AddAnimePage />} />
          <Route path="/anime/edit/:id" element={<EditAnimePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {!isAuthPage && !hideFooter && <Footer />}
      </div>
    </div>
  );
}

export default App;
