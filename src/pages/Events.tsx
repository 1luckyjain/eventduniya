import  { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import axios from 'axios';

function Events() {
  const { token } = useAuth();
  // Updated static events to use _id instead of id
  const staticEvents = [
    {
      _id: 'static-4',
      title: "Art Gallery Opening",
      date: "2025-08-01",
      time: "5:00 PM",
      location: "Metropolitan Gallery",
      city: "Chicago",
      image: "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?auto=format&fit=crop&w=800",
      description: "Opening night featuring works from emerging contemporary artists.",
      type: "Exhibition",
      genere: "Visual Arts",
      capacity: 150,
      fees: "Free"
    }
  ];

  const [dynamicEvents, setDynamicEvents] = useState<any[]>([]);
  const [bookedEvents, setBookedEvents] = useState<string[]>([]);
  const auth = useAuth();
  const userId = auth.user?._id;

  // Fetch dynamic events
  useEffect(() => {
    fetch('http://localhost:5000/api/events/')
      .then((response) => response.json())
      .then((data) => {
        const eventsArray = Array.isArray(data) ? data : data.events || [];
        setDynamicEvents(eventsArray);
      })
      .catch((error) => console.error('Error fetching events:', error));

  }, []);
  const axiosConfig = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  // Fetch booked events for the user
  useEffect(() => {
    async function fetchUserBookedEvents() {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/user/events',
          { userId },
          axiosConfig
        );
        // Ensure the response data is an array
        const booked = Array.isArray(response.data.eventIds)
          ? response.data.eventIds
          : [];
        setBookedEvents(booked);
        console.log("Booked events:", booked);
      } catch (error) {
        console.error("Error fetching user events:", error);
      }
    }
    if (userId) {
      fetchUserBookedEvents();
    }
  }, [userId]);

  const handleBookTicket = async (_id: string) => {
    if (bookedEvents.includes(_id)) {
      alert("You have already booked a ticket for this event.");
      return;
    }
    try {
      const payload = { userId, eventId: _id };
      const response = await axios.post(
        `http://localhost:5000/api/bookticket/${_id}`,
        payload,
        axiosConfig
      );
     
      setBookedEvents((prev) => [...prev, _id]);
      alert("Ticket booked successfully!");
    } catch (error) {
      console.error("Error booking ticket:", error);
      alert("Booking failed. Please try again.");
    }
  };

  const combinedEvents = [...staticEvents, ...dynamicEvents];
  
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-purple-900/30 to-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
              Upcoming Experiences
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Immerse yourself in unforgettable moments of art and culture
            </p>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {combinedEvents.map((event) => (
              <div
                key={event._id}
                className="group relative bg-gray-900 rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20"
              >
                <div className="relative aspect-video">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {event.genere}
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-100 mb-3">
                      {event.title}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base line-clamp-3 mb-4">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-5 w-5 mr-3 text-purple-400" />
                      <span className="text-sm">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="h-5 w-5 mr-3 text-purple-400" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-5 w-5 mr-3 text-purple-400" />
                      <span className="text-sm">
                        {event.location}, {event.city}
                      </span>
                    </div>
                  </div>

                  {bookedEvents.includes(event._id) ? (
                    <button
                      disabled
                      className="w-full bg-emerald-600/30 text-emerald-400 px-6 py-3 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 border border-emerald-600/50"
                    >
                      <button className="h-4 w-4" />
                      Ticket Confirmed
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBookTicket(event._id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-600/30 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                    >
                      Reserve Seats
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/30 rounded-3xl p-8 md:p-16 text-center backdrop-blur-lg border border-purple-900/30">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-200 bg-clip-text text-transparent">
              Never Miss a Moment
            </h2>
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Sync with our event calendar and plan your cultural journey
            </p>
            <button className="bg-white/90 text-purple-900 px-8 py-4 rounded-xl font-semibold hover:bg-white transition-all hover:shadow-lg hover:shadow-purple-900/20 flex items-center gap-2 mx-auto">
              <Calendar className="h-5 w-5" />
              View Full Calendar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Events;