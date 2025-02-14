// src/pages/ArtistSignup.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
// Update the import line at the top of the file
import { 
  Mail, Lock, User, MapPin, Phone, Tag, Video, Instagram, Twitter, Youtube, 
  Facebook, Music, AlertCircle, ArrowRight  // Add AlertCircle here
} from "lucide-react";

import { useAuth } from "../context/auth-context";
import { STATUS } from "../utils/utils";

interface ArtistSignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phoneNumber: string;
  tag: string;
  bio: string;
  videoLink1: string;
  videoLink2?: string;
  videoLink3?: string;
  instagram: string;
  twitter?: string;
  youtube?: string;
  facebook?: string;
  tiktok?: string;
}

const ArtistSignup: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields },
    getValues,
  } = useForm<ArtistSignupFormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      phoneNumber: "",
      tag: "",
      bio: "",
      videoLink1: "",
      videoLink2: "",
      videoLink3: "",
      instagram: "",
      twitter: "",
      youtube: "",
      facebook: "",
      tiktok: "",
    },
    mode: "onChange",
  });

  const navigate = useNavigate();
  const { login, setAuthenticationStatus } = useAuth();

  const onSubmit = async (values: ArtistSignupFormValues) => {
    // Ensure passwords match (react-hook-form validation already handles this)
    if (values.password !== values.confirmPassword) {
      return;
    }

    // Create the newArtist object matching your Artist schema
    const newArtist = {
      username: values.username,
      email: values.email,
      password: values.password,
      role: "Artist",
      city: values.city,
      state: values.state,
      country: values.country,
      pincode: values.pincode,
      phoneNumber: values.phoneNumber,
      tag: values.tag,
      bio: values.bio,
      videoLink1: values.videoLink1,
      videoLink2: values.videoLink2,
      videoLink3: values.videoLink3,
      instagram: values.instagram,
      twitter: values.twitter,
      youtube: values.youtube,
      facebook: values.facebook,
      tiktok: values.tiktok,
    };

    try {
      setAuthenticationStatus(STATUS.PENDING);
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        newArtist,
        { withCredentials: true }
      );
      setAuthenticationStatus(STATUS.SUCCEEDED);
      console.log("Signup response:", response.data);
      const { user, token, expiresAt } = response.data;
      login(user, token, expiresAt);
      navigate("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      setAuthenticationStatus(STATUS.FAILED);
      // Optionally, display an error message here
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Join Our EventDuniya
            </h1>
            <p className="text-purple-100 text-lg">
              Showcase your talent to the world
            </p>
          </div>

          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                  </div>
                  
                  <InputField
                    icon={<User size={18} className="text-gray-400" />}
                    label="Username"
                    id="username"
                    register={register}
                    error={errors.username}
                    validation={{ required: true, minLength: 2 }}
                    placeholder="ArtistName123"
                  />

                  <InputField
                    icon={<Mail size={18} className="text-gray-400" />}
                    label="Email"
                    id="email"
                    type="email"
                    register={register}
                    error={errors.email}
                    validation={{ 
                      required: true, 
                      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
                    }}
                    placeholder="artist@example.com"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-semibold">Security</h2>
                  </div>

                  <InputField
                    icon={<Lock size={18} className="text-gray-400" />}
                    label="Password"
                    id="password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: true, minLength: 6, maxLength: 30 }}
                    placeholder="••••••••"
                  />

                  <InputField
                    icon={<Lock size={18} className="text-gray-400" />}
                    label="Confirm Password"
                    id="confirmPassword"
                    type="password"
                    register={register}
                    error={errors.confirmPassword}
                    validation={{ required: true, validate: (value: string) => value === getValues("password") }}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Location Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-semibold">Location Details</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="City"
                      id="city"
                      register={register}
                      error={errors.city}
                      validation={{ required: true }}
                      placeholder="e.g. New York"
                    />

                    <InputField
                      label="State"
                      id="state"
                      register={register}
                      error={errors.state}
                      validation={{ required: true }}
                      placeholder="e.g. New York"
                    />
                  </div>

                  <InputField
                    label="Country"
                    id="country"
                    register={register}
                    error={errors.country}
                    validation={{ required: true }}
                    placeholder="e.g. United States"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Pincode"
                      id="pincode"
                      register={register}
                      error={errors.pincode}
                      validation={{ required: true }}
                      placeholder="e.g. 10001"
                    />

                    <InputField
                      icon={<Phone size={18} className="text-gray-400" />}
                      label="Phone Number"
                      id="phoneNumber"
                      register={register}
                      error={errors.phoneNumber}
                      validation={{ required: true }}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>

                {/* Artist Details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Music className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-semibold">Artist Profile</h2>
                  </div>

                  <InputField
                    icon={<Tag size={18} className="text-gray-400" />}
                    label="Tagline"
                    id="tag"
                    register={register}
                    error={errors.tag}
                    validation={{ required: true }}
                    placeholder="e.g. Contemporary Painter"
                  />

                  <div className="relative">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      {...register("bio", { required: true })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={4}
                      placeholder="Describe your artistic journey..."
                    />
                    {errors.bio && <ErrorText message={errors.bio.message} />}
                  </div>
                </div>
              </div>

              {/* Video Links Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b pb-2">
                  <Video className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold">Portfolio Videos</h2>
                </div>
                
                <InputField
                  label="Video Link 1 (Required)"
                  id="videoLink1"
                  register={register}
                  error={errors.videoLink1}
                  validation={{ required: true }}
                  placeholder="YouTube/Vimeo link"
                />

                <InputField
                  label="Video Link 2 (Optional)"
                  id="videoLink2"
                  register={register}
                  placeholder="YouTube/Vimeo link"
                />

                <InputField
                  label="Video Link 3 (Optional)"
                  id="videoLink3"
                  register={register}
                  placeholder="YouTube/Vimeo link"
                />
              </div>

              {/* Social Media Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b pb-2">
                  <Instagram className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold">Social Profiles</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <InputField
                    icon={<Instagram size={18} className="text-gray-400" />}
                    label="Instagram"
                    id="instagram"
                    register={register}
                    error={errors.instagram}
                    validation={{ required: true }}
                    placeholder="@yourhandle"
                  />

                  <InputField
                    icon={<Twitter size={18} className="text-gray-400" />}
                    label="Twitter (Optional)"
                    id="twitter"
                    register={register}
                    placeholder="@yourhandle"
                  />

                  <InputField
                    icon={<Youtube size={18} className="text-gray-400" />}
                    label="YouTube (Optional)"
                    id="youtube"
                    register={register}
                    placeholder="Channel URL"
                  />

                  <InputField
                    icon={<Facebook size={18} className="text-gray-400" />}
                    label="Facebook (Optional)"
                    id="facebook"
                    register={register}
                    placeholder="Profile URL"
                  />
                </div>
              </div>

              {/* Submit Section */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <button className="w-5 h-5" />
                  Complete Artist Registration
                </button>

                <p className="text-center text-gray-600 mt-4">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-purple-600 font-semibold hover:underline hover:text-purple-700"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({
  icon,
  label,
  id,
  type = "text",
  register,
  error,
  validation,
  placeholder,
}: any) => (
  <div className="relative">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        id={id}
        type={type}
        {...register(id, validation)}
        placeholder={placeholder}
        className={`w-full px-4 ${icon ? 'pl-10' : 'pl-4'} py-3 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
      />
    </div>
    {error && <ErrorText message={error.message} />}
  </div>
);

//Error Message Component
const ErrorText = ({ message }: { message?: string }) => (
  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
    <AlertCircle className="w-4 h-4" />
    {message}
  </p>
);

export default ArtistSignup;