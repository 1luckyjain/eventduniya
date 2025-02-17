import React, { useEffect, useState } from 'react';
import {
  User,
  Ticket,
  Bell,
  Settings,
  LogOut,
  Heart,
  MapPin,
  Calendar,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/auth-context';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function UserProfile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Basic profile info
  const userProfile = {
    name: user?.username || "Your Name",
    email: user?.email || "you@example.com",
    joinDate: "January 2025",
    avatar:
      user?.avatar ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300",
  };

  const userId = user?._id;

  // Axios configuration with token header
  const axiosConfig = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // State for upcoming events (booked events)
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  // State for saved artists (fetched from API)
  const [savedArtists, setSavedArtists] = useState<any[]>([]);
  // State for queries (if the user is an artist)
  const [queries, setQueries] = useState<any[]>([]);

  // Fetch upcoming events for the user
  useEffect(() => {
    async function fetchBookedEvents() {
      try {
        // 1. Fetch all events from the API.
        const allEventsResponse = await axios.get(
          'https://eventduniya-server.onrender.com/api/events',
          axiosConfig
        );
        const allEvents = Array.isArray(allEventsResponse.data)
          ? allEventsResponse.data
          : [];

        // 2. Fetch booked event IDs for the user.
        const eventIdsResponse = await axios.post(
          'https://eventduniya-server.onrender.com/api/user/events',
          { userId },
          axiosConfig
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

  // Fetch saved artists for the logged-in user
  useEffect(() => {
    async function fetchSavedArtists() {
      try {
        // First, get the list of saved artist IDs for the user
        const response = await axios.get(
          `https://eventduniya-server.onrender.com/api/savedartist?userId=${userId}`,
          axiosConfig
        );
        if (Array.isArray(response.data)) {
          const artistIds = response.data.map((item: any) => item.artistId);

          // Now, retrieve full artist details for each saved artist using the "api/artist" endpoint
          const artistRequests = artistIds.map((id: string) =>
            axios.get(`https://eventduniya-server.onrender.com/api/artist/${id}`, axiosConfig)
          );
          const artistsResponses = await Promise.all(artistRequests);
          const artistsData = artistsResponses.map((resp) => resp.data);
          setSavedArtists(artistsData);
        }
      } catch (error) {
        console.error("Error fetching saved artists:", error);
      }
    }
    if (userId) {
      fetchSavedArtists();
    }
  }, [userId]);

  // If the user is an artist, fetch the queries sent to them.
  useEffect(() => {
    async function fetchQueries() {
      try {
        const response = await axios.get(
          `https://eventduniya-server.onrender.com/api/contact?artistId=${userId}`,
          axiosConfig
        );
        if (Array.isArray(response.data)) {
          setQueries(response.data);
        }
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    }
    if (userId && user.role === 'Artist') {
      fetchQueries();
    }
  }, [userId, user]);

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
                  { icon: Ticket, label: 'Create Events', path: '/create-event' },
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
                    onClick={() => {
                      if (item.path) {
                        navigate(item.path);
                      }
                    }}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <Link to="/logout" className="text-sm font-medium">
                    Logout
                  </Link>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                  <Plus className="h-5 w-5 flex-shrink-0" />
                  <Link to="/create-event" className="text-sm font-medium">
                    Create Event
                  </Link>
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
                              day: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        </div>
                        <button className="mt-2 md:mt-0 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-all flex items-center gap-2">
                          <span className="h-4 w-4" />
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
                {savedArtists.length > 0 ? (
                  savedArtists.map((artist, index) => (
                    <div key={index} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {artist.avatars && artist.avatars.length > 0 ? (
                            <img
                              src={artist.avatars[0]}
                              alt={artist.username}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-purple-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{artist.username}</h4>
                          <Link
                            to={`/artist/${artist._id}`}
                            className="text-purple-400 hover:text-purple-300 text-sm mt-1 transition-colors"
                          >
                            View Profile →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">No saved artists</div>
                    <p className="text-sm text-gray-500">Your saved artists will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Queries Section (Visible only if user is an artist) */}
            {user?.role === 'Artist' && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Bell className="h-6 w-6 text-purple-400" />
                  <span>Queries</span>
                </h3>
                <div className="grid gap-4">
                  {queries.length > 0 ? (
                    queries.map((query, index) => (
                      <div key={index} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700/50 transition-all">
                        <h4 className="font-semibold text-lg">
                          {query.subject || "No Subject"}
                        </h4>
                        <p className="text-gray-400 text-sm mt-1">{query.message}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          From: {query.senderEmail || "Anonymous"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">No queries</div>
                      <p className="text-sm text-gray-500">
                        No queries have been sent yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

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
