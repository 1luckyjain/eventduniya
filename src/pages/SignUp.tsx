import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';

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
    formState: { errors, touchedFields },
    getValues,
  } = useForm<SignupFormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const navigate = useNavigate();
  const { login, setAuthenticationStatus } = useAuth();

  const onSubmit = async (values: SignupFormValues) => {
    // Create newUser object matching the Mongoose model (role will be User)
    const newUser = {
      username: values.username,
      email: values.email,
      password: values.password,
      role: "User",
    };

    try {
      setAuthenticationStatus(STATUS.PENDING);
      const response = await axios.post("http://localhost:5000/api/auth/signup", newUser);
      setAuthenticationStatus(STATUS.SUCCEEDED);
      console.log(response.data);
      const { user, token, expiresAt } = response.data;
      login(user, token, expiresAt);
      navigate("/");
    } catch (error) {
      setAuthenticationStatus(STATUS.FAILED);
    }
  };

  // Handler for Google OAuth success
  const handleGoogleSuccess = (credentialResponse: any) => {
  
    // Typically, you'll send credentialResponse.credential (JWT) to your backend for verification
    // and then log in the user. For example:
    axios
      .post("http://localhost:5000/api/auth/google", { credential: credentialResponse.credential }, { withCredentials: true })
      .then((response) => {
        const { user, token, expiresAt } = response.data;
        login(user, token, expiresAt);
        navigate("/");
      })
      .catch((error) => {
        console.error("Google login error:", error);
      });
  };

  const handleGoogleError = () => {
    console.log("Google sign in failed");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg text-black shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-bold text-center mb-6">Create New Account</h1>

          {/* Username */}
          <div className="mb-4">
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              type="text"
              id="username"
              placeholder="Username"
              {...register("username", {
                required: { value: true, message: "Username is required." },
                minLength: { value: 2, message: "Username cannot be less than 2 characters" },
              })}
            />
            {touchedFields.username && errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              type="email"
              id="email"
              autoComplete="email"
              placeholder="Email"
              {...register("email", {
                required: { value: true, message: "Email is required." },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email",
                },
              })}
            />
            {touchedFields.email && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              type="password"
              id="password"
              autoComplete="new-password"
              placeholder="Password"
              {...register("password", {
                required: { value: true, message: "Password is required." },
                minLength: { value: 6, message: "Password cannot be less than 6 characters" },
                maxLength: { value: 30, message: "Password cannot be more than 30 characters" },
              })}
            />
            {touchedFields.password && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: { value: true, message: "Confirm Password is required." },
                validate: (value: string) =>
                  value === getValues("password") || "Confirm password does not match the password",
              })}
            />
            {touchedFields.confirmPassword && errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
            type="submit"
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
        {/* Option to Sign Up with Google */}
        <div className="mt-6">
          <p className="text-center text-gray-600">Or sign up with</p>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className="w-full mt-4 flex items-center justify-center bg-red-500 text-white p-3 rounded hover:bg-red-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-6 h-6 mr-2"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.624,4.492-6.093,8-11.303,8c-6.627,0-12-5.373-12-12
                    c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.97,3.03l5.657-5.657C34.063,6.807,29.429,4,24,4C12.954,4,4,12.954,4,24
                    s8.954,20,20,20s20-8.954,20-20C44,22.14,43.78,21.176,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,16.695,18.768,14,24,14c3.059,0,5.842,1.154,7.97,3.03l5.657-5.657
                    C34.063,6.807,29.429,4,24,4C16.318,4,9.656,8.201,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.368C29.671,35.091,26.93,36,24,36
                    c-5.211,0-9.68-3.208-11.283-7.691l-6.55,5.07C9.656,39.799,16.318,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.126-4.087,5.482l6.19,5.368
                    C41.871,33.205,43,28.792,43,24C43,22.14,43.78,21.176,43.611,20.083z"
                  />
                </svg>
                Sign Up with Google
              </button>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
