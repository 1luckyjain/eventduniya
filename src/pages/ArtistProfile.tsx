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
        className="h-48 w-full relative "
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
        {/* Image Container */}
        <div className="w-full max-w-[200px] md:max-w-full mx-auto mb-4 
                        overflow-hidden rounded-lg border-4 border-purple-500
                        hover:scale-105 transition-transform duration-300">
          <img 
            src={profileImage} 
            alt={artistProfile.username}
            className="w-full h-auto object-cover aspect-square"
          />
        </div>
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
              {/* <nav className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg bg-purple-500 text-white">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-500 hover:bg-gray-800">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav> */}
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
            <div className="bg-gray-900 rounded-xl p-6 md:p-8">
  <h3 className="text-2xl font-bold mb-6 text-center md:text-left">Videos</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Video 1 */}
    <a 
      href={artistProfile.videoLink1} 
      className="group flex items-center p-4 rounded-lg bg-gray-800 hover:bg-purple-900/20 transition-all duration-300 border border-gray-700 hover:border-purple-500"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span className="text-purple-400 group-hover:text-purple-300 font-medium transition-colors">Video 1</span>
        </div>
      </div>
      <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
      </svg>
    </a>

    {/* Video 2 - Conditional */}
    {artistProfile.videoLink2 && (
      <a 
        href={artistProfile.videoLink2} 
        className="group flex items-center p-4 rounded-lg bg-gray-800 hover:bg-purple-900/20 transition-all duration-300 border border-gray-700 hover:border-purple-500"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span className="text-purple-400 group-hover:text-purple-300 font-medium transition-colors">Video 2</span>
          </div>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
        </svg>
      </a>
    )}

    {/* Video 3 - Conditional */}
    {artistProfile.videoLink3 && (
      <a 
        href={artistProfile.videoLink3} 
        className="group flex items-center p-4 rounded-lg bg-gray-800 hover:bg-purple-900/20 transition-all duration-300 border border-gray-700 hover:border-purple-500"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span className="text-purple-400 group-hover:text-purple-300 font-medium transition-colors">Video 3</span>
          </div>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
        </svg>
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
