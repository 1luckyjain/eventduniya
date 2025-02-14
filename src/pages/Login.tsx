import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

import { STATUS } from "../utils/utils";
import { useAuth } from "../context/auth-context";

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields },
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const navigate = useNavigate();
  const { login, setAuthenticationStatus } = useAuth();

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    const user = {
      username: values.username,
      password: values.password,
    };

    try {
      setAuthenticationStatus(STATUS.PENDING);
      const response = await axios.post("http://localhost:5000/api/auth/login", user,{
        withCredentials: true,
      });
      console.log(response);
      setAuthenticationStatus(STATUS.SUCCEEDED);
      const { user: userObj, token, expiresAt } = response.data;
      login(userObj, token, expiresAt);
      navigate("/");
    } catch (error: any) {
      alert(error.response.data.error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

          {/* Username */}
          <div className="mb-4">
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              type="text"
              id="username"
              aria-label="Username or Email"
              required
              placeholder="Username or Email"
              {...register("username", {
                required: { value: true, message: "This field is required." },
              })}
            />
            {touchedFields.username && errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              type="password"
              id="password"
              required
              placeholder="Password"
              {...register("password", {
                required: { value: true, message: "Password is required." },
              })}
            />
            {touchedFields.password && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
            type="submit"
          >
            Sign In
          </button>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link className="text-blue-500 hover:underline" to="/sign-up">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
