import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
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
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: "onChange",
  });

  const navigate = useNavigate();
  const { login, setAuthenticationStatus } = useAuth();

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      setAuthenticationStatus(STATUS.PENDING);
      const response = await axios.post(
        "https://eventduniya-server.onrender.com/api/auth/login",
        {
          username: values.username,
          password: values.password,
        },
        { withCredentials: true }
      );
      
      setAuthenticationStatus(STATUS.SUCCEEDED);
      const { user: userObj, token, expiresAt } = response.data;
      login(userObj, token, expiresAt);
      navigate("/");
    } catch (error: any) {
      setAuthenticationStatus(STATUS.FAILED);
      alert(error.response?.data?.error?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-purple-100"></p>
        </div>

        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register("username", { required: "This field is required" })}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    {...register("password", { required: "Password is required" })}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
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
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <button className="w-5 h-5" />
              Sign In
            </button>

            <div className="text-center space-y-4">
              <Link
                to="/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot password?
              </Link>
              
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-purple-600 font-semibold hover:underline hover:text-purple-700"
                >
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;