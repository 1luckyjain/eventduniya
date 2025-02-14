import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, LogOut, Instagram, Twitter, Globe, Edit 
} from 'lucide-react';
import { useAuth } from '../context/auth-context';

// Define the interface according to the Artist schema
export interface IArtistProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatars: string[];
  city: string;
  state: string;
  country: string;
  pincode: string;
  phoneNumber: string;
  tag: string;
  bio: string;
  videoLink1: string;
  videoLink2?: string;
  videoLink3?: string;
  instagram: string;
  twitter?: string;
  youtube?: string;
  facebook?: string;
  tiktok?: string;
  createdAt: string;
  updatedAt: string;
}

const ArtistProfile: React.FC = () => {
  // Retrieve the artist ID from the URL
  const { id } = useParams<{ id: string }>();
  const [artistProfile, setArtistProfile] = useState<IArtistProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = useAuth(); // Must be called at the top level
  const token = auth.token;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Fetch artist data with credentials and an Authorization header
    fetch(`${API_URL}/api/artist/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include', // ensures cookies are sent
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: IArtistProfile) => {
        setArtistProfile(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching artist:', error);
        setLoading(false);
      });
  }, [id, token]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!artistProfile) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        Artist not found.
      </div>
    );
  }

  // Use the first avatar for both the cover image and the profile image.
  const coverImage = artistProfile.avatars.length > 0 
    ? artistProfile.avatars[0] 
    : 'https://via.placeholder.com/2000x500';
  const profileImage = artistProfile.avatars.length > 0 
    ? artistProfile.avatars[0] 
    : 'https://via.placeholder.com/150';

  return (
    <div className="bg-black min-h-screen">
      {/* Cover Image */}
      <div 
        className="h-80 w-full relative"
        style={{
          backgroundImage: `url(${coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black"></div>
      </div>

      <div className="container mx-auto px-6 -mt-20 relative">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <img 
                  src={profileImage} 
                  alt={artistProfile.username}
                  className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-purple-500"
                />
                <h2 className="text-xl font-bold">{artistProfile.username}</h2>
                <p className="text-purple-500">{artistProfile.tag}</p>
              </div>
              <div className="flex justify-center space-x-4 mb-6">
                {artistProfile.instagram && (
                  <a href={artistProfile.instagram} className="text-gray-400 hover:text-purple-500">
                    <Instagram className="h-6 w-6" />
                  </a>
                )}
                {artistProfile.twitter && (
                  <a href={artistProfile.twitter} className="text-gray-400 hover:text-purple-500">
                    <Twitter className="h-6 w-6" />
                  </a>
                )}
                {artistProfile.facebook && (
                  <a href={artistProfile.facebook} className="text-gray-400 hover:text-purple-500">
                    <Globe className="h-6 w-6" />
                  </a>
                )}
              </div>
              <nav className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg bg-purple-500 text-white">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-500 hover:bg-gray-800">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            {/* Bio Section */}
            <div className="bg-gray-900 rounded-xl p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">About</h3>
                <button className="text-purple-500 hover:text-purple-400">
                  <Edit className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-300">{artistProfile.bio}</p>
            </div>

            {/* Video Links Section */}
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Videos</h3>
              <div className="space-y-2">
                <a href={artistProfile.videoLink1} className="text-purple-500 hover:underline">
                  Video 1
                </a>
                {artistProfile.videoLink2 && (
                  <a href={artistProfile.videoLink2} className="text-purple-500 hover:underline">
                    Video 2
                  </a>
                )}
                {artistProfile.videoLink3 && (
                  <a href={artistProfile.videoLink3} className="text-purple-500 hover:underline">
                    Video 3
                  </a>
                )}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Contact Details</h3>
              <ul className="text-gray-300">
                <li>
                  <strong>Email:</strong> {artistProfile.email}
                </li>
                <li>
                  <strong>Phone:</strong> {artistProfile.phoneNumber}
                </li>
                <li>
                  <strong>Location:</strong> {artistProfile.city}, {artistProfile.state}, {artistProfile.country} - {artistProfile.pincode}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
