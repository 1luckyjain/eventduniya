// CreateEvent.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

export interface IEvent {
  image: string;
  fees: string;
  title: string;
  date: Date;
  location: string;
  city: string;
  time: string;
  description: string;
  type: string;
  capacity: number;
  genere: string;
}

const CreateEvent: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Set up form state; date is kept as string for the input and later converted
  const [formData, setFormData] = useState({
    image: '',
    fees: '',
    title: '',
    date: '',
    location: '',
    city: '',
    time: '',
    description: '',
    type: '',
    capacity: '',
    genere: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Build payload converting capacity to number and date to a Date object
    const payload: IEvent = {
      image: formData.image,
      fees: formData.fees,
      title: formData.title,
      date: new Date(formData.date),
      location: formData.location,
      city: formData.city,
      time: formData.time,
      description: formData.description,
      type: formData.type,
      capacity: Number(formData.capacity),
      genere: formData.genere,
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include', // ensures cookies are sent with the request
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }

      const data = await response.json();
      setSuccess('Event created successfully!');
      // Optionally, redirect to the new event's page:
      // navigate(`/events/${data._id}`);
      // Or clear the form:
      setFormData({
        image: '',
        fees: '',
        title: '',
        date: '',
        location: '',
        city: '',
        time: '',
        description: '',
        type: '',
        capacity: '',
        genere: '',
      });

      navigate('/events');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label htmlFor="image" className="block text-sm font-medium">
            Image URL
          </label>
          <input
            type="text"
            name="image"
            id="image"
            value={formData.image}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="fees" className="block text-sm font-medium">
            Fees
          </label>
          <input
            type="text"
            name="fees"
            id="fees"
            value={formData.fees}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium">
            location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium">
            City
          </label>
          <input
            type="text"
            name="city"
            id="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium">
            Time
          </label>
          <input
            type="text"
            name="time"
            id="time"
            value={formData.time}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 p-2 rounded"
            placeholder="e.g., 18:30"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium">
            Type
          </label>
          <input
            type="text"
            name="type"
            id="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium">
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            id="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="genere" className="block text-sm font-medium">
            Genre
          </label>
          <input
            type="text"
            name="genere"
            id="genere"
            value={formData.genere}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 p-2 rounded"
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
