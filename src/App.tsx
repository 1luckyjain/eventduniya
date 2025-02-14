// App.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import axios from 'axios';
import { Menu, X } from 'lucide-react';
import Home from './pages/Home';
import Artist from './pages/Artist';
import Events from './pages/Events';
import Contact from './pages/Contact';
import UserProfile from './pages/UserProfile';
import ArtistProfile from './pages/ArtistProfile';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import ArtistSignup from './pages/ArtistSignup';
import CreateEvent from './pages/createEvent';
import Logout from './pages/Logout';
import { useAuth } from './context/auth-context';

// PublicRoute component to prevent logged-in users from accessing public pages
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { token, user, login, logout, isAuthenticated, expiresAt } = useAuth();

  // Function to refresh the access token
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/refresh',
        {},
        { withCredentials: true }
      );
      const { user: refreshedUser, accessToken, expiresAt: refreshedExpiresAt } = response.data;
      if (response.status === 204) {
        logout();
      } else {
        login(refreshedUser, accessToken, refreshedExpiresAt);
      }
    } catch (error) {
      logout();
    }
  }, [login, logout]);

  useEffect(() => {
    refreshAccessToken();
  }, [refreshAccessToken]);

  useEffect(() => {
    let refreshAccessTokenTimerId: NodeJS.Timeout;
    if (isAuthenticated && expiresAt) {
      const timeout = new Date(expiresAt).getTime() - Date.now() - 10 * 1000;
      refreshAccessTokenTimerId = setTimeout(() => {
        refreshAccessToken();
      }, timeout);
    }
    return () => {
      if (refreshAccessTokenTimerId) clearTimeout(refreshAccessTokenTimerId);
    };
  }, [expiresAt, isAuthenticated, refreshAccessToken]);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <nav className="fixed w-full bg-black/90 backdrop-blur-sm z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-purple-500">
              EventDuniya
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="hover:text-purple-500 transition">
                Home
              </Link>
              <Link to="/artist" className="hover:text-purple-500 transition">
                Artists
              </Link>
              <Link to="/events" className="hover:text-purple-500 transition">
                Events
              </Link>
              <Link to="/contact" className="hover:text-purple-500 transition">
                Contact
              </Link>
              {token ? (
                <>
                  <Link to="/profile" className="hover:text-purple-500 transition">
                    {user.username}
                  </Link>
                  <Link to="/create-event" className="hover:text-purple-500 transition">
                    Create Event
                  </Link>
                  <Link to="/logout" className="hover:text-purple-500 transition">
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup" className="hover:text-purple-500 transition">
                    Signup
                  </Link>
                  <Link to="/login" className="hover:text-purple-500 transition">
                    Login
                  </Link>
                  <Link to="/artistsignup" className="hover:text-purple-500 transition">
                    ArtistSignup
                  </Link>
                </>
              )}
            </div>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/95 backdrop-blur-lg">
              <div className="container mx-auto px-6 py-4">
                <div className="flex flex-col space-y-4">
                  <Link
                    to="/"
                    className="hover:text-purple-500 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/artist"
                    className="hover:text-purple-500 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Artists
                  </Link>
                  <Link
                    to="/events"
                    className="hover:text-purple-500 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Events
                  </Link>
                  <Link
                    to="/contact"
                    className="hover:text-purple-500 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  {token ? (
                    <>
                      <Link
                        to="/profile"
                        className="hover:text-purple-500 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {user.username}
                      </Link>
                      <Link
                        to="/create-event"
                        className="hover:text-purple-500 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Create Event
                      </Link>
                      <Link
                        to="/logout"
                        className="hover:text-purple-500 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Logout
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/signup"
                        className="hover:text-purple-500 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Signup
                      </Link>
                      <Link
                        to="/login"
                        className="hover:text-purple-500 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/artistsignup"
                        className="hover:text-purple-500 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        ArtistSignup
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artist" element={<Artist />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/artist/:id" element={<ArtistProfile />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/logout" element={<Logout />} />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/artistsignup"
              element={
                <PublicRoute>
                  <ArtistSignup />
                </PublicRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-black/90 text-white py-12 mt-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold text-purple-500 mb-4">
                  EventDuniya
                </h3>
                <p className="text-gray-400">
                  Celebrating creativity and artistic expression through unforgettable experiences.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-purple-500">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/artist" className="text-gray-400 hover:text-purple-500">
                      Artists
                    </Link>
                  </li>
                  <li>
                    <Link to="/events" className="text-gray-400 hover:text-purple-500">
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-gray-400 hover:text-purple-500">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact Info</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>123 Art Street</li>
                  <li>New York, NY 10001</li>
                  <li>contact@eventduniya.com</li>
                  <li>(555) 123-4567</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-purple-500">
                    Instagram
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-500">
                    Twitter
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-500">
                    Facebook
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 EventDuniya. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
