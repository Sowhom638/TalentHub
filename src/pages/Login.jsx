// src/pages/Login.jsx
import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  Building2,
  Star,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { toast, ToastContainer } from "react-toastify";

export default function Login() {
  const [role, setRole] = useState("applicant");
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ role, ...form })).unwrap();
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/jobs");
      }, 2000);
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };

  const refreshData = () => {
    setForm({
      email: "",
      password: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-200 p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white border-4 border-black">
        {/* ==================== LEFT PANEL ==================== */}
        <div className="lg:w-1/2 relative bg-linear-to-br from-cyan-300 via-purple-300 to-pink-300 p-6 sm:p-10 lg:p-12 flex flex-col gap-8 overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-black">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-300 rounded-full opacity-60" />
          <div className="absolute bottom-10 right-10 w-52 h-52 bg-green-400 rounded-full opacity-60" />

          {/* Logo */}
          <div className="flex items-center gap-3 z-10">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border-2 border-white">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black text-black">
              Talent<span className="text-white px-2 py-0.5 rounded-lg">Hub</span>
            </span>
          </div>

          {/* Heading */}
          <div className="z-10 space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black text-black leading-tight">
              Welcome back 👋
            </h1>
            <p className="text-black font-medium text-sm sm:text-base max-w-md bg-white/80 p-4 rounded-xl border-2 border-black">
              Sign in to continue your journey — find jobs, connect with
              recruiters, or manage your hiring pipeline.
            </p>
          </div>

          {/* Role Selector */}
          <div className="z-10 space-y-4">
            <p className="text-sm font-black text-black uppercase tracking-wide">Sign in as</p>

            {/* Applicant */}
            <button
              type="button"
              onClick={() => {
                setRole("applicant");
                refreshData();
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-4 border-black transition-all text-left ${
                role === "applicant"
                  ? "bg-purple-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black hover:-translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 border-black ${
                  role === "applicant"
                    ? "bg-white text-black"
                    : "bg-gray-100 text-black"
                }`}
              >
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-lg">Applicant</p>
                <p className={`text-sm font-medium ${role === "applicant" ? "text-white/90" : "text-gray-600"}`}>
                  Find jobs, apply and manage your applications.
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center shrink-0 ${
                  role === "applicant"
                    ? "bg-white"
                    : "bg-transparent"
                }`}
              >
                {role === "applicant" && (
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                )}
              </div>
            </button>

            {/* Recruiter */}
            <button
              type="button"
              onClick={() => {
                setRole("recruiter");
                refreshData();
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-4 border-black transition-all text-left ${
                role === "recruiter"
                  ? "bg-cyan-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black hover:-translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 border-black ${
                  role === "recruiter"
                    ? "bg-white text-black"
                    : "bg-gray-100 text-black"
                }`}
              >
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-lg">Recruiter</p>
                <p className={`text-sm font-medium ${role === "recruiter" ? "text-black/80" : "text-gray-600"}`}>
                  Post jobs, find talent and manage applicants.
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center shrink-0 ${
                  role === "recruiter"
                    ? "bg-white"
                    : "bg-transparent"
                }`}
              >
                {role === "recruiter" && (
                  <div className="w-3 h-3 bg-cyan-400 rounded-full" />
                )}
              </div>
            </button>

            <p className="text-sm font-bold text-black pt-2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-700 hover:text-purple-900 underline decoration-2 underline-offset-2"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Illustration */}
          <div className="hidden sm:flex z-10 items-center justify-center gap-3 mt-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-300 rounded-full flex items-center justify-center mb-2 border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-4 w-40 sm:w-48 border-4 border-black">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full shrink-0 border-2 border-black" />
                <div className="min-w-0 flex-1">
                  <div className="w-16 sm:w-20 h-3 bg-gray-200 rounded-full mb-1.5 border-2 border-black" />
                  <div className="w-12 sm:w-14 h-2 bg-gray-100 rounded-full border-2 border-black" />
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"
                    fill="currentColor"
                    stroke="black"
                    strokeWidth="1.5"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-400 rounded-full flex items-center justify-center mb-2 border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
              </div>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT PANEL — FORM ==================== */}
        <div className="lg:w-1/2 flex items-center justify-center p-5 sm:p-8 lg:p-12 bg-yellow-50">
          <div className="w-full max-w-lg">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-3xl sm:text-4xl font-black text-black">
                Sign in to your account
              </h2>
              <p className="text-gray-700 mt-2 text-sm sm:text-base font-medium">
                Enter your credentials to access your dashboard
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1.5 mb-6 sm:mb-8 border-2 border-black">
              <button
                type="button"
                onClick={() => {
                  setRole("applicant");
                  refreshData();
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-black transition-all border-2 ${
                  role === "applicant"
                    ? "bg-purple-500 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    : "text-black border-transparent hover:bg-gray-200"
                }`}
              >
                <User className="w-4 h-4" />
                Applicant
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("recruiter");
                  refreshData();
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-black transition-all border-2 ${
                  role === "recruiter"
                    ? "bg-cyan-400 text-black border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    : "text-black border-transparent hover:bg-gray-200"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Recruiter
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-black text-black mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-black text-black">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                  <input
                    type={showPw ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-gray-600 p-1"
                  >
                    {showPw ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`w-full py-4 text-black font-black rounded-xl text-base border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2 mt-6 ${
                  role === "applicant"
                    ? "bg-purple-500"
                    : "bg-cyan-400"
                }`}
              >
                Sign In
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}