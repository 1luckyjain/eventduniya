// Artist.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Star,
  StarHalf,
  Heart,
} from 'lucide-react';
import { useAuth } from '../context/auth-context';

// Component to fetch reviews for an artist and display the average rating as stars.
const ArtistRating = ({ artistId }: { artistId: string }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';

  useEffect(() => {
    axios
      .get(`${API_URL}/api/review?artistId=${artistId}`)
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          const sum = data.reduce((acc: number, review: any) => acc + review.rating, 0);
          const avg = sum / data.length;
          setAverageRating(avg);
        } else {
          setAverageRating(0);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
        setAverageRating(0);
        setLoading(false);
      });
  }, [artistId, API_URL]);

  if (loading) {
    return <div className="text-gray-300 text-xs">Loading rating...</div>;
  }

  const fullStars = Math.floor(averageRating);
  const halfStar = averageRating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center mt-2">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={`full-${index}`} className="w-4 h-4 text-yellow-400" />
      ))}
      {halfStar && <StarHalf className="w-4 h-4 text-yellow-400" />}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star key={`empty-${index}`} className="w-4 h-4 text-gray-400" />
      ))}
      <span className="text-gray-300 ml-1 text-sm">({averageRating.toFixed(1)})</span>
    </div>
  );
};

function Artist() {
  // Static artist(s)
  const staticArtists = [
    {
      _id: '4',
      username: 'David Thompson',
      avatars: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500',
      ],
      tag: 'Visual Artist',
      bio: 'Mixed-media artist whose work explores the intersection of nature and technology.',
      instagram: '#',
      twitter: '#',
      youtube: '',
      facebook: '',
      tiktok: '',
    },
  ];

  // Get token and user info from auth context.
  const { token, user } = useAuth();
  const [dynamicArtists, setDynamicArtists] = useState([]);
  const [savedArtistIds, setSavedArtistIds] = useState<string[]>([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';

  // Navigation when clicking on an artist
  const handleOnClick = (id: string) => {
    if (!token) {
      navigate(`/signup`);
      return;
    }
    navigate(`/artist/${id}`);
  };

  // Fetch dynamic artists using axios
  useEffect(() => {
    axios
      .get(`${API_URL}/api/artist/list`)
      .then((response) => setDynamicArtists(response.data))
      .catch((error) => console.error('Error fetching artists:', error));
  }, [API_URL]);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Fetch saved artists for the logged-in user using axios
  useEffect(() => {
    if (user && user._id) {
      axios
        .get(`${API_URL}/api/savedartist?userId=${user._id}` , {
          withCredentials: true, headers 
        })
        .then((response) => {
          const data = response.data;
          if (Array.isArray(data)) {
            // Assuming each item has an "artistId" property
            setSavedArtistIds(data.map((item: any) => item.artistId));
          }
        })
        .catch((error) => console.error('Error fetching saved artists:', error));
    }
  }, [user, API_URL]);

  // Toggle saving/unsaving an artist using axios with headers
  const toggleSaveArtist = (artistId: string) => {
    if (!user || !user._id) {
      navigate('/signup');
      return;
    }

    // Common header configuration

    if (savedArtistIds.includes(artistId)) {
      // Unsaving the artist
      axios
        .post(
          `${API_URL}/api/savedartist/delete?userId=${user._id}&artistId=${artistId}`,
          {},
          { withCredentials: true, headers }
        )
        .then((response) => {
          if (response.status === 201) {
            setSavedArtistIds((prev) => prev.filter((id) => id !== artistId));
          } else {
            console.error('Error unsaving artist');
          }
        })
        .catch((error) => console.error('Error unsaving artist:', error));
    } else {
      // Saving the artist
      axios
        .post(
          `${API_URL}/api/savedartist/create`,
          { userId: user._id, artistId },
          { withCredentials: true, headers }
        )
        .then((response) => {
          if (response.status === 201) {
            setSavedArtistIds((prev) => [...prev, artistId]);
          } else {
            console.error('Error saving artist');
          }
        })
        .catch((error) => console.error('Error saving artist:', error));
    }
  };

  const combinedArtists = [...staticArtists, ...dynamicArtists];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-28 bg-gradient-to-b from-purple-900/30 to-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
              Meet the <span className="text-purple-500">Artists</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
              Discover visionary artists shaping the future of cultural expression
            </p>
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {combinedArtists.map((artist) => (
              <div
                key={artist._id}
                className="group relative bg-gray-900 rounded-2xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/20"
                onClick={() => handleOnClick(artist._id)}
              >
                {/* Save Artist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveArtist(artist._id);
                  }}
                  className="absolute top-4 left-4 z-10"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      savedArtistIds.includes(artist._id) ? 'text-red-500' : 'text-gray-300'
                    }`}
                  />
                </button>

                <div className="relative aspect-square">
                  <img
                    src={artist.avatars?.[0] || 'https://via.placeholder.com/500'}
                    alt={artist.username}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                <div className="p-6 md:p-8 absolute bottom-0 left-0 right-0">
                  <div className="mb-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                      {artist.username}
                    </h3>
                    <p className="text-purple-400 font-medium">{artist.tag}</p>
                    {/* Star rating section */}
                    <ArtistRating artistId={artist._id} />
                  </div>
                  <p className="text-gray-300 line-clamp-3 mb-6 text-sm md:text-base">
                    {artist.bio}
                  </p>

                  <div className="flex space-x-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    {artist.instagram && (
                      <a
                        href={artist.instagram}
                        className="text-gray-300 hover:text-purple-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                    )}
                    {artist.twitter && (
                      <a
                        href={artist.twitter}
                        className="text-gray-300 hover:text-purple-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Twitter className="w-6 h-6" />
                      </a>
                    )}
                    {artist.youtube && (
                      <a
                        href={artist.youtube}
                        className="text-gray-300 hover:text-purple-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Youtube className="w-6 h-6" />
                      </a>
                    )}
                    {artist.facebook && (
                      <a
                        href={artist.facebook}
                        className="text-gray-300 hover:text-purple-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Facebook className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
                  View Profile
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/30 rounded-3xl p-8 md:p-16 text-center backdrop-blur-lg border border-purple-900/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-stripes.png')] opacity-10" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-200 bg-clip-text text-transparent">
              Ready to Shine?
            </h2>
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              We're always looking for talented artists to join our community. Share your art with our audience.
            </p>
            <button
              className="bg-white/90 text-purple-900 px-8 py-4 rounded-xl font-semibold hover:bg-white transition-all hover:shadow-lg hover:shadow-purple-900/20 flex items-center gap-2 mx-auto relative z-10"
              onClick={() => window.location.assign('http://localhost:5173/artistsignup')}
            >
              <span className="h-5 w-5" />
              Join Now!
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Artist;
