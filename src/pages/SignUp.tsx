import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';
import { Mail, User, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../context/auth-context";
import { STATUS } from "../utils/utils";

interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<SignupFormValues>({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  const navigate = useNavigate();
  const { login, setAuthenticationStatus } = useAuth();

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setAuthenticationStatus(STATUS.PENDING);
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        username: values.username,
        email: values.email,
        password: values.password,
        role: "User",
      });
      
      setAuthenticationStatus(STATUS.SUCCEEDED);
      const { user, token, expiresAt } = response.data;
      login(user, token, expiresAt);
      navigate("/");
    } catch (error) {
      setAuthenticationStatus(STATUS.FAILED);
    }
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    axios.post("http://localhost:5000/api/auth/google", 
      { credential: credentialResponse.credential }, 
      { withCredentials: true }
    ).then((response) => {
      const { user, token, expiresAt } = response.data;
      login(user, token, expiresAt);
      navigate("/");
    }).catch((error) => {
      console.error("Google login error:", error);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Create Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {/* Username */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("username", { 
                    required: "Username is required",
                    minLength: {
                      value: 2,
                      message: "Username must be at least 2 characters"
                    }
                  })}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address"
                    }
                  })}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    },
                    maxLength: {
                      value: 30,
                      message: "Password cannot exceed 30 characters"
                    }
                  })}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  {...register("confirmPassword", { 
                    required: "Please confirm your password",
                    validate: value => 
                      value === getValues("password") || "Passwords do not match"
                  })}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-gray-500 text-sm">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.error("Google Sign Up failed")}
              render={({ onClick, disabled }) => (
                <button
                  onClick={onClick}
                  disabled={disabled}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 p-3 rounded-lg border border-gray-300 hover:border-blue-500 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-6 h-6"
                  >
                    <path
                      fill="#4285F4"
                      d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 45c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 45 24 45z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M11.69 27.18C11.25 25.86 11 24.45 11 23s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 23s.85 5.91 2.34 8.88l7.35-5.7z"
                    />
                    <path
                      fill="#EA4335"
                      d="M24 10.75c3.24 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 5.93 4.34 13.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
                    />
                  </svg>
                  <span className="font-medium">Sign up with Google</span>
                </button>
              )}
            />
          </div>
        </div>

        <p className="text-center text-gray-600 mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;