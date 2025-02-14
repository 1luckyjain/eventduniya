import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import axios from 'axios';

function Events() {
  // Updated static events to use _id instead of id
  const staticEvents = [
    {
      _id: 'static-1',
      title: "Symphony Under the Stars",
      date: "2025-07-15",
      time: "8:00 PM",
      location: "Central Park Amphitheater",
      city: "New York",
      image: "https://images.unsplash.com/photo-1470019693664-1d202d2c0907?auto=format&fit=crop&w=800",
      description: "An enchanting evening of classical masterpieces performed under the open sky.",
      type: "Concert",
      genere: "Classical",
      capacity: 500,
      fees: "$50"
    },
    {
      _id: 'static-2',
      title: "Jazz Night Fusion",
      date: "2025-07-20",
      time: "7:30 PM",
      location: "Blue Note Jazz Club",
      city: "New York",
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800",
      description: "Experience the fusion of traditional jazz with contemporary rhythms.",
      type: "Concert",
      genere: "Jazz",
      capacity: 200,
      fees: "$40"
    },
    {
      _id: 'static-3',
      title: "Modern Dance Showcase",
      date: "2025-07-25",
      time: "6:00 PM",
      location: "Contemporary Arts Center",
      city: "Los Angeles",
      image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=800",
      description: "A showcase of innovative choreography and expressive movement.",
      type: "Performance",
      genere: "Dance",
      capacity: 300,
      fees: "$30"
    },
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

  // Fetch booked events for the user
  useEffect(() => {
    async function fetchUserBookedEvents() {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/user/events',
          { userId },
          { withCredentials: true }
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
        { withCredentials: true }
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
    <div className="bg-black">
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Upcoming <span className="text-purple-500">Events</span>
            </h1>
            <p className="text-xl text-gray-300">
              Discover our carefully curated selection of performances, exhibitions, and cultural events.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {combinedEvents.map((event, index) => (
              <div
                key={event._id || index}
                className="bg-gray-900 rounded-xl overflow-hidden group hover:transform hover:-translate-y-1 transition duration-300"
              >
                <div className="relative">
                  <img src={event.image} alt={event.title} className="w-full h-64 object-cover" />
                  <div className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-1 rounded-full">
                    {event.genere}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
                  <p className="text-gray-300 mb-6">{event.description}</p>
                  <div className="space-y-3 text-gray-400 mb-8">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3" />
                      {event.location}, {event.city}
                    </div>
                  </div>
                  {bookedEvents.includes(event._id) ? (
                    <button
                      disabled
                      className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center cursor-not-allowed"
                    >
                      Ticket Booked
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBookTicket(event._id)}
                      className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition flex items-center justify-center"
                    >
                      Book Tickets <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-purple-900 to-purple-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">View Full Calendar</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Explore our complete schedule of events and plan your visits ahead.
            </p>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition">
              Open Calendar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Events;
