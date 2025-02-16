// CreateEvent.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import {
  AlertCircle,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Music,
  Tag,
  Users,
} from 'lucide-react';

export interface IEvent {
  image: string;
  image1: string;
  image2: string;
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
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // Set up form state; date is kept as a string for the input and later converted
  const [formData, setFormData] = useState({
    image: '',
    image1: '',
    image2: '',
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

  // Handle text/number input changes for non-file fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to upload a file using /api/image/upload and update the corresponding image field
  const uploadFile = async (
    file: File,
    field: 'image' | 'image1' | 'image2'
  ) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      // Request presigned URL from backend
      const res = await fetch(`${API_URL}/api/image/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include', 
        body: JSON.stringify({
          imageName: file.name,
          imageType: file.type,
        }),
      });
      const data = await res.json();
      if (!data.uploadUrl) {
        throw new Error('Could not get upload URL');
      }

      // Upload file directly to S3 using the presigned URL
      const uploadRes = await fetch(data.uploadUrl, {
        method: 'PUT',
        body: file,
      });
      if (!uploadRes.ok) {
        throw new Error('Failed to upload image');
      }

      // Update the corresponding image field in state with the final image URL
      setFormData(prev => ({ ...prev, [field]: data.imageUrl }));
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Error uploading image');
    }
  };

  // Handler for file input changes
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'image' | 'image1' | 'image2'
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await uploadFile(file, field);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Build payload converting capacity to number and date to a Date object
    const payload: IEvent = {
      image: formData.image,
      image1: formData.image1,
      image2: formData.image2,
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

      // Clear the form
      setFormData({
        image: '',
        image1: '',
        image2: '',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800/50 rounded-2xl shadow-xl p-6 md:p-8 lg:p-10">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            Create New Event
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 p-4 rounded-lg flex items-center gap-3 text-red-400 border border-red-500/30">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 p-4 rounded-lg flex items-center gap-3 text-green-400 border border-green-500/30">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* Image Upload Section */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Primary Image (required)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'image')}
                  required
                  className="block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-semibold
                             file:bg-purple-600 file:text-white
                             hover:file:bg-purple-700"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Primary"
                    className="mt-2 h-20 object-contain rounded"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Secondary Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'image1')}
                  className="block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-semibold
                             file:bg-purple-600 file:text-white
                             hover:file:bg-purple-700"
                />
                {formData.image1 && (
                  <img
                    src={formData.image1}
                    alt="Secondary"
                    className="mt-2 h-20 object-contain rounded"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Tertiary Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'image2')}
                  className="block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-semibold
                             file:bg-purple-600 file:text-white
                             hover:file:bg-purple-700"
                />
                {formData.image2 && (
                  <img
                    src={formData.image2}
                    alt="Tertiary"
                    className="mt-2 h-20 object-contain rounded"
                  />
                )}
              </div>
            </div>

            {/* Other Event Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={<DollarSign className="h-5 w-5 text-gray-400" />}
                label="Fees"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                placeholder="Free or $50"
                required
              />
              <InputField
                icon={<Tag className="h-5 w-5 text-gray-400" />}
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Summer Music Festival"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={<Calendar className="h-5 w-5 text-gray-400" />}
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <InputField
                icon={<Clock className="h-5 w-5 text-gray-400" />}
                label="Time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="18:30"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Central Park Amphitheater"
                required
              />
              <InputField
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
                required
              />
            </div>

            <InputField
              icon={<Tag className="h-5 w-5 text-gray-400" />}
              label="Event Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Concert, Exhibition, etc."
              required
            />

            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={<Users className="h-5 w-5 text-gray-400" />}
                label="Capacity"
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="500"
                required
              />
              <InputField
                icon={<Music className="h-5 w-5 text-gray-400" />}
                label="Genre"
                name="genere"
                value={formData.genere}
                onChange={handleChange}
                placeholder="Rock, Classical, etc."
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/20 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
                rows={5}
                placeholder="Describe your event in detail..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 px-6 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component for text/number/date fields
interface InputFieldProps {
  icon?: React.ReactNode;
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-gray-700/20 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500`}
      />
    </div>
  </div>
);

export default CreateEvent;
