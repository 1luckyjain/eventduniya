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
    <div className="bg-black">
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Featured <span className="text-purple-500">Artists</span>
            </h1>
            <p className="text-xl text-gray-300">
              Meet the extraordinary talents who bring their unique vision and creativity to our stage.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {combinedArtists.map((artist, index) => (
              <div
                key={artist._id || index}
                className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:-translate-y-1 transition duration-300 cursor-pointer"
                onClick={()=>{handleOnClick(artist._id)}}
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={artist.avatars && artist.avatars.length > 0 ? artist.avatars[0] : 'https://via.placeholder.com/500'} 
                    alt={artist.username}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{artist.username}</h3>
                  <p className="text-purple-500 mb-4">{artist.tag}</p>
                  <p className="text-gray-300 mb-6">{artist.bio}</p>
                  <div className="flex space-x-4">
                    {artist.instagram && (
                      <a
                        href={artist.instagram}
                        className="text-gray-400 hover:text-purple-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Instagram />
                      </a>
                    )}
                    {artist.twitter && (
                      <a
                        href={artist.twitter}
                        className="text-gray-400 hover:text-purple-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Twitter />
                      </a>
                    )}
                    {artist.youtube && (
                      <a
                        href={artist.youtube}
                        className="text-gray-400 hover:text-purple-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Youtube />
                      </a>
                    )}
                    {artist.facebook && (
                      <a
                        href={artist.facebook}
                        className="text-gray-400 hover:text-purple-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Facebook />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-purple-900 to-purple-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Are You an Artist?</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              We're always looking for talented artists to join our community. Share your art with our audience.
            </p>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition">
              Apply to Perform
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Artist;
