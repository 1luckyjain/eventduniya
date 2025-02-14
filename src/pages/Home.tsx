import React from 'react';
import { ArrowRight, Music2, Users, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[90vh] flex items-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center md:text-left">
          <div className="max-w-2xl mx-auto md:max-w-3xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-snug md:leading-tight">
              Where Art Comes <span className="text-purple-500">Alive</span>
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8 max-w-[600px] mx-auto md:mx-0">
              Experience the magic of live performances, art exhibitions, and cultural events.
            </p>
            <div className="flex flex-col md:flex-row justify-center md:justify-start gap-3 md:gap-4">
              <Link 
                to="/events"
                className="bg-purple-500 text-white px-5 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-purple-600 transition flex items-center justify-center gap-2 text-sm md:text-base"
              >
                Explore Events <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </Link>
              <Link 
                to="/artist"
                className="border border-white text-white px-5 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-white hover:text-black transition flex items-center justify-center text-sm md:text-base"
              >
                Meet Artists
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 md:gap-8 md:grid-cols-3">
            {[{
              icon: <Music2 className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />, 
              title: "Live Performances",
              description: "Experience soul-stirring live music from world-renowned artists."
            }, {
              icon: <Users className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />, 
              title: "Artist Showcases",
              description: "Discover emerging talents and established artists in our curated showcases."
            }, {
              icon: <Calendar className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />, 
              title: "Regular Events",
              description: "Join our weekly events celebrating various art forms and cultures."
            }].map((feature, index) => (
              <div key={index} className="bg-gray-900 p-5 md:p-8 rounded-xl hover:-translate-y-1 transition-transform">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm md:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 md:py-16 bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              Subscribe to our newsletter for the latest events, artist announcements, and exclusive offers.
            </p>
            <form className="flex flex-col md:flex-row gap-3 md:gap-4 w-full">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 md:px-6 md:py-4 rounded-full bg-gray-900 border border-gray-800 focus:ring-2 focus:ring-purple-500 outline-none text-sm md:text-base"
              />
              <button
                type="submit"
                className="bg-purple-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-purple-600 transition text-sm md:text-base whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;