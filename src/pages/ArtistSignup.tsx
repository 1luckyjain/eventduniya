// src/pages/ArtistSignup.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg text-black shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Artist Signup</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block mb-1 font-semibold">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              {...register("username", {
                required: "Username is required.",
                minLength: {
                  value: 2,
                  message: "Username must be at least 2 characters.",
                },
              })}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value:
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address.",
                },
              })}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters.",
                },
                maxLength: {
                  value: 30,
                  message: "Password must be less than 30 characters.",
                },
              })}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm Password is required.",
                validate: (value: string) =>
                  value === getValues("password") ||
                  "Passwords do not match.",
              })}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {/* City */}
          <div>
            <label htmlFor="city" className="block mb-1 font-semibold">
              City
            </label>
            <input
              type="text"
              id="city"
              placeholder="City"
              {...register("city", { required: "City is required." })}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>
          {/* State */}
          <div>
            <label htmlFor="state" className="block mb-1 font-semibold">
              State
            </label>
            <input
              type="text"
              id="state"
              placeholder="State"
              {...register("state", { required: "State is required." })}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>
          {/* Country */}
          <div>
            <label htmlFor="country" className="block mb-1 font-semibold">
              Country
            </label>
            <input
              type="text"
              id="country"
              placeholder="Country"
              {...register("country", { required: "Country is required." })}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">
                {errors.country.message}
              </p>
            )}
          </div>
          {/* Pincode */}
          <div>
            <label htmlFor="pincode" className="block mb-1 font-semibold">
              Pincode
            </label>
            <input
              type="text"
              id="pincode"
              placeholder="Pincode"
              {...register("pincode", { required: "Pincode is required." })}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pincode.message}
              </p>
            )}
          </div>
          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block mb-1 font-semibold">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              placeholder="Phone Number"
              {...register("phoneNumber", {
                required: "Phone Number is required.",
              })}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          {/* Tag */}
          <div>
            <label htmlFor="tag" className="block mb-1 font-semibold">
              Tag
            </label>
            <input
              type="text"
              id="tag"
              placeholder="Tag"
              {...register("tag", { required: "Tag is required." })}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.tag && (
              <p className="text-red-500 text-sm mt-1">{errors.tag.message}</p>
            )}
          </div>
          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block mb-1 font-semibold">
              Bio
            </label>
            <textarea
              id="bio"
              placeholder="Bio"
              {...register("bio", { required: "Bio is required." })}
              className="w-full p-3 border border-gray-300 rounded"
            ></textarea>
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>
          {/* Video Link 1 */}
          <div>
            <label htmlFor="videoLink1" className="block mb-1 font-semibold">
              Video Link 1
            </label>
            <input
              type="text"
              id="videoLink1"
              placeholder="Video Link 1"
              {...register("videoLink1", {
                required: "Video Link 1 is required.",
              })}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.videoLink1 && (
              <p className="text-red-500 text-sm mt-1">
                {errors.videoLink1.message}
              </p>
            )}
          </div>
          {/* Video Link 2 (Optional) */}
          <div>
            <label htmlFor="videoLink2" className="block mb-1 font-semibold">
              Video Link 2 (Optional)
            </label>
            <input
              type="text"
              id="videoLink2"
              placeholder="Video Link 2"
              {...register("videoLink2")}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          {/* Video Link 3 (Optional) */}
          <div>
            <label htmlFor="videoLink3" className="block mb-1 font-semibold">
              Video Link 3 (Optional)
            </label>
            <input
              type="text"
              id="videoLink3"
              placeholder="Video Link 3"
              {...register("videoLink3")}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          {/* Instagram */}
          <div>
            <label htmlFor="instagram" className="block mb-1 font-semibold">
              Instagram
            </label>
            <input
              type="text"
              id="instagram"
              placeholder="Instagram"
              {...register("instagram", {
                required: "Instagram is required.",
              })}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.instagram && (
              <p className="text-red-500 text-sm mt-1">
                {errors.instagram.message}
              </p>
            )}
          </div>
          {/* Twitter (Optional) */}
          <div>
            <label htmlFor="twitter" className="block mb-1 font-semibold">
              Twitter (Optional)
            </label>
            <input
              type="text"
              id="twitter"
              placeholder="Twitter"
              {...register("twitter")}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          {/* YouTube (Optional) */}
          <div>
            <label htmlFor="youtube" className="block mb-1 font-semibold">
              YouTube (Optional)
            </label>
            <input
              type="text"
              id="youtube"
              placeholder="YouTube"
              {...register("youtube")}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          {/* Facebook (Optional) */}
          <div>
            <label htmlFor="facebook" className="block mb-1 font-semibold">
              Facebook (Optional)
            </label>
            <input
              type="text"
              id="facebook"
              placeholder="Facebook"
              {...register("facebook")}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          {/* TikTok (Optional) */}
          <div>
            <label htmlFor="tiktok" className="block mb-1 font-semibold">
              TikTok (Optional)
            </label>
            <input
              type="text"
              id="tiktok"
              placeholder="TikTok"
              {...register("tiktok")}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link className="text-blue-500 hover:underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ArtistSignup;
