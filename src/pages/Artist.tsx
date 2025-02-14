// Artist.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import { useAuth } from '../context/auth-context';

function Artist() {
  // Use _id for static artists.
  const staticArtists = [
    {
      _id: '1',
      username: "Elena Rodriguez",
      avatars: ["https://images.unsplash.com/photo-1549213783-8284d0336c4f?auto=format&fit=crop&w=500"],
      tag: "Classical Pianist",
      bio: "International award-winning pianist known for her dynamic interpretations of classical masterpieces.",
      instagram: "#",
      twitter: "#",
      youtube: "#",
      facebook: "#",
      tiktok: ""
    },
    {
      _id: '2',
      username: "Marcus Chen",
      avatars: ["https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=500"],
      tag: "Jazz Saxophonist",
      bio: "Pioneering jazz artist blending traditional and contemporary styles into unique compositions.",
      instagram: "#",
      twitter: "#",
      youtube: "",
      facebook: "#",
      tiktok: ""
    },
    {
      _id: '3',
      username: "Sarah Williams",
      avatars: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500"],
      tag: "Contemporary Dancer",
      bio: "Renowned choreographer and performer pushing the boundaries of modern dance.",
      instagram: "#",
      twitter: "#",
      youtube: "",
      facebook: "",
      tiktok: ""
    },
    {
      _id: '4',
      username: "David Thompson",
      avatars: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500"],
      tag: "Visual Artist",
      bio: "Mixed-media artist whose work explores the intersection of nature and technology.",
      instagram: "#",
      twitter: "#",
      youtube: "",
      facebook: "",
      tiktok: ""
    }
  ];

  const [dynamicArtists, setDynamicArtists] = useState([]);
  const navigate = useNavigate();
  const token  = useAuth().token; 
  const handleOnClick = (id : string) => {
    if(!token){
      navigate(`/signup`);
     return  ; 
    }
     navigate(`/artist/${id}`)
  }
  
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/artist/list`)
      .then((response) => response.json())
      .then((data) => setDynamicArtists(data))
      .catch((error) => console.error('Error fetching artists:', error));
  }, []);
   
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
                <div className="relative aspect-square">
                  <img 
                    src={artist.avatars?.[0] || 'https://via.placeholder.com/500'} 
                    alt={artist.username}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                
                <div className="p-6 md:p-8 absolute bottom-0 left-0 right-0">
                  <div className="mb-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {artist.username}
                    </h3>
                    <p className="text-purple-400 font-medium">{artist.tag}</p>
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
              <button className="h-5 w-5" />
              Join Now!
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Artist;