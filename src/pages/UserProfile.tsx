import React, { useEffect, useState } from 'react';
import { User, Ticket, Bell, Settings, LogOut, Heart, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import axios from 'axios';

function UserProfile() {
  const auth = useAuth();
  const user = auth.user;
  
  // Build basic profile info from the authenticated user.
  const userProfile = {
    name: user?.username || "Your Name",
    email: user?.email || "you@example.com",
    joinDate: "January 2025",
    avatar:
      user?.avatar ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300",
    savedArtists: user?.savedArtists || ["Elena Rodriguez", "Marcus Chen"],
  };

  // State for upcoming events (booked events)
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const userId = user?._id;

  useEffect(() => {
    async function fetchBookedEvents() {
      try {
        // 1. Fetch all events from the API.
        const allEventsResponse = await axios.get(
          'http://localhost:5000/api/events',
          { withCredentials: true }
        );
        const allEvents = Array.isArray(allEventsResponse.data)
          ? allEventsResponse.data
          : [];

        // 2. Fetch booked event IDs for the user.
        const eventIdsResponse = await axios.post(
          'http://localhost:5000/api/user/events',
          { userId },
          { withCredentials: true }
        );
        const bookedEventIds = Array.isArray(eventIdsResponse.data.eventIds)
          ? eventIdsResponse.data.eventIds
          : [];
        console.log("Booked event IDs:", bookedEventIds);

        // 3. Filter all events using the booked event IDs.
        const filteredEvents = allEvents.filter((event: any) =>
          bookedEventIds.includes(event._id)
        );
        setUpcomingEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching booked events:", error);
      }
    }
    if (userId) {
      fetchBookedEvents();
    }
  }, [userId]);

 
  return (
    <div className="bg-black min-h-screen py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-6 xl:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative group mb-4">
                  <img 
                    src={userProfile.avatar} 
                    alt={userProfile.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-500/30 hover:border-purple-500/50 transition-all"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-purple-500/20 transition-all" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                  {userProfile.name}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Member since {userProfile.joinDate}
                </p>
              </div>
              
              <nav className="space-y-1.5">
                {[
                  { icon: User, label: 'Profile', active: true },
                  { icon: Ticket, label: 'My Tickets' },
                  { icon: Bell, label: 'Notifications' },
                  { icon: Settings, label: 'Settings' },
                ].map((item, index) => (
                  <button
                    key={index}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      item.active 
                        ? 'bg-purple-500/10 text-purple-400'
                        : 'text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6 xl:space-y-8">
            {/* Upcoming Events */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-purple-400" />
                <span>Upcoming Events</span>
              </h3>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <div key={index} className="group relative bg-gray-800 rounded-xl p-5 hover:bg-gray-700/50 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-shrink-0">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{event.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        </div>
                        <button className="mt-2 md:mt-0 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-all flex items-center gap-2">
                          <button className="h-4 w-4" />
                          View Ticket
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">No upcoming events</div>
                    <p className="text-sm text-gray-500">Your booked events will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Saved Artists */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Heart className="h-6 w-6 text-purple-400" />
                <span>Saved Artists</span>
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {userProfile.savedArtists.map((artist: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                  <div key={index} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{artist}</h4>
                        <button className="text-purple-400 hover:text-purple-300 text-sm mt-1 transition-colors">
                          View Profile →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Settings className="h-6 w-6 text-purple-400" />
                <span>Preferences</span>
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', checked: true },
                  { label: 'SMS Updates', checked: false },
                ].map((pref, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700/30 rounded-lg p-4">
                    <span className="text-gray-300">{pref.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        defaultChecked={pref.checked} 
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-purple-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;