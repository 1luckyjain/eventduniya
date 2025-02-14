import React, { useEffect, useState } from 'react';
import { User, Ticket, Bell, Settings, LogOut } from 'lucide-react';
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
    <div className="bg-black min-h-screen py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name}
                  className="w-32 h-32 rounded-full mb-4 object-cover"
                />
                <h2 className="text-xl font-bold">{userProfile.name}</h2>
                <p className="text-gray-400">Member since {userProfile.joinDate}</p>
              </div>
              <nav className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg bg-purple-500 text-white">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800">
                  <Ticket className="h-5 w-5" />
                  <span>My Tickets</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
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
            {/* Upcoming Events */}
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Upcoming Events</h3>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                        <p className="text-sm text-purple-500">Ticket ID: {event.ticketId}</p>
                      </div>
                      <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
                        View Ticket
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No upcoming events found.</p>
                )}
              </div>
            </div>

            {/* Saved Artists */}
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Saved Artists</h3>
              <div className="grid grid-cols-2 gap-4">
                {userProfile.savedArtists.map((artist, index) => (
                  <div key={index} className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold">{artist}</h4>
                    <button className="mt-2 text-purple-500 hover:text-purple-400">
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span>SMS Updates</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
