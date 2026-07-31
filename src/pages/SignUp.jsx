// src/pages/SignUp.jsx
import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Tag,
  FileText,
  Briefcase,
  Building2,
  Globe,
  Users,
  Factory,
  Image as ImageIcon,
  Camera,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signupUser } from "../redux/slices/authSlice";
import { toast, ToastContainer } from "react-toastify";

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [role, setRole] = useState("applicant");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
    experience: "",
    location: "",
    skills: "",
    resume: null,
    companyName: "",
    companyWebsite: "",
    jobTitle: "",
    companySize: "",
    industry: "",
    companyLogo: null,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e, key) => {
    const file = e.target.files[0];
    setForm({ ...form, [key]: file });
    if (key === "profileImage" && file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setForm({ ...form, profileImage: null });
    setProfilePreview(null);
  };

  const refreshForm = () => {
    setProfilePreview(null);
    setForm({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImage: null,
      experience: "",
      location: "",
      skills: "",
      resume: null,
      companyName: "",
      companyWebsite: "",
      jobTitle: "",
      companySize: "",
      industry: "",
      companyLogo: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!form.fullName.trim() || !form.email.trim() || !form.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (role === "applicant") {
      if (!form.experience || !form.location || !form.skills) {
        toast.error("Please select Experience and enter Location and skills.");
        return;
      }
    } else if (role === "recruiter") {
      if (
        !form.companyName.trim() ||
        !form.jobTitle.trim() ||
        !form.companySize ||
        !form.industry
      ) {
        toast.error("Please fill in all required company details.");
        return;
      }
    }

    const formData = new FormData();
    formData.append("role", role);
    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("confirmPassword", form.confirmPassword);
    formData.append("experience", form.experience || "");
    formData.append("location", form.location || "");
    formData.append("skills", form.skills || "");
    formData.append("companyName", form.companyName || "");
    formData.append("companyWebsite", form.companyWebsite || "");
    formData.append("jobTitle", form.jobTitle || "");
    formData.append("companySize", form.companySize || "");
    formData.append("industry", form.industry || "");

    if (form.profileImage) formData.append("profileImage", form.profileImage);
    if (form.resume) formData.append("resume", form.resume);
    if (form.companyLogo) formData.append("companyLogo", form.companyLogo);

    setIsSubmitting(true);
    try {
      await dispatch(signupUser(formData)).unwrap();
      toast.success("Welcome!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err || "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isApplicant = role === "applicant";

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-200 p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white border-4 border-black">
        {/* ==================== LEFT PANEL ==================== */}
        <div className="lg:w-1/2 relative bg-linear-to-br from-purple-300 via-pink-300 to-yellow-300 p-6 sm:p-10 lg:p-12 flex flex-col gap-8 overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-black">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-300 rounded-full opacity-60" />
          <div className="absolute bottom-10 right-10 w-52 h-52 bg-green-400 rounded-full opacity-60" />

          <div className="flex items-center gap-3 z-10">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border-2 border-white">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black text-black">
              Talent
              <span className="text-white px-2 py-0.5 rounded-lg">Hub</span>
            </span>
          </div>

          <div className="z-10 space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black text-black leading-tight">
              Create your account
            </h1>
            <p className="text-black font-medium text-sm sm:text-base max-w-md bg-white/80 p-4 rounded-xl border-2 border-black">
              Join TalentHub and take the next step in your{" "}
              {isApplicant ? "career" : "hiring"} journey.
            </p>
          </div>

          <div className="z-10 space-y-4">
            <p className="text-sm font-black text-black uppercase tracking-wide">
              I want to register as
            </p>
            <button
              type="button"
              onClick={() => {
                setRole("applicant");
                refreshForm();
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
                <p
                  className={`text-sm font-medium ${role === "applicant" ? "text-white/90" : "text-gray-600"}`}
                >
                  Find jobs, apply and manage your applications.
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("recruiter");
                refreshForm();
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
                <p
                  className={`text-sm font-medium ${role === "recruiter" ? "text-black/80" : "text-gray-600"}`}
                >
                  Post jobs, find talent and manage applicants.
                </p>
              </div>
            </button>
            <p className="text-sm font-bold text-black pt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-700 hover:text-purple-900 underline decoration-2 underline-offset-2"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* ==================== RIGHT PANEL — FORM ==================== */}
        <div className="lg:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-12 bg-yellow-50">
          <div className="w-full max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-black text-black">
                {isApplicant ? "Join as an Applicant" : "Join as a Recruiter"}
              </h2>
              <p className="text-gray-700 mt-3 text-sm sm:text-base font-medium">
                {isApplicant
                  ? "Tell us about yourself to discover your next opportunity"
                  : "Tell us about your company to start hiring top talent"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isApplicant && (
                <div className="flex flex-col items-center gap-4">
                  <label className="text-sm font-black text-black">
                    Profile Photo
                  </label>
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-cyan-400 border-4 border-black flex items-center justify-center overflow-hidden transition-all">
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-black">
                          <Camera className="w-7 h-7 mb-0.5" />
                          <span className="text-[10px] font-black">
                            ADD PHOTO
                          </span>
                        </div>
                      )}
                    </div>
                    {profilePreview && (
                      <button
                        type="button"
                        onClick={removeProfileImage}
                        className="absolute -top-1 -right-1 w-7 h-7 bg-red-400 border-2 border-black rounded-full flex items-center justify-center text-black hover:bg-red-500 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <label className="absolute bottom-0 right-0 w-9 h-9 bg-purple-500 border-2 border-black rounded-full flex items-center justify-center cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFile(e, "profileImage")}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-black mb-2">
                    {isApplicant ? "Full Name" : "Your Full Name"}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                      required
                    />
                  </div>
                </div>
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
                      className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-black mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                    <input
                      type={showPw ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="w-full pl-12 pr-12 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
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
                <div>
                  <label className="block text-sm font-black text-black mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                    <input
                      type={showCpw ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full pl-12 pr-12 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCpw(!showCpw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-gray-600 p-1"
                    >
                      {showCpw ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {isApplicant && (
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  <h3 className="text-sm font-black text-black uppercase tracking-wide border-b-4 border-black pb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" /> Professional Details
                  </h3>
                  <div>
                    <label className="block text-sm font-black text-black mb-2">
                      Experience
                    </label>
                    <select
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50 appearance-none cursor-pointer"
                    >
                      <option value="">Select your experience</option>
                      <option value="fresher">Fresher</option>
                      <option value="1-2 years">1–2 years</option>
                      <option value="3-5 years">3–5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-black mb-2">
                        Current Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                        <input
                          type="text"
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          placeholder="Enter your current location"
                          className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-black mb-2">
                        Skills
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                        <input
                          type="text"
                          name="skills"
                          value={form.skills}
                          onChange={handleChange}
                          placeholder="e.g. React, Node.js, SQL"
                          className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-black mb-2">
                      Upload Resume{" "}
                      <span className="text-gray-600 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-2 border-black rounded-xl p-3 bg-gray-50">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-purple-200 rounded-lg border-2 border-black flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-black" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-black truncate">
                            {form.resume
                              ? form.resume.name
                              : "Upload your resume"}
                          </p>
                          <p className="text-xs text-gray-600 font-medium">
                            PDF, DOC or DOCX (Max 5MB)
                          </p>
                        </div>
                      </div>
                      <label className="px-5 py-2.5 bg-purple-500 text-white text-sm font-black rounded-lg cursor-pointer border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all shrink-0 w-full sm:w-auto text-center">
                        Browse
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFile(e, "resume")}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {role === "recruiter" && (
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  <h3 className="text-sm font-black text-black uppercase tracking-wide border-b-4 border-black pb-2 flex items-center gap-2">
                    <Building2 className="w-5 h-5" /> Company Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-black mb-2">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                        <input
                          type="text"
                          name="companyName"
                          value={form.companyName}
                          onChange={handleChange}
                          placeholder="e.g. Acme Corp"
                          className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-black mb-2">
                        Company Website{" "}
                        <span className="text-gray-600 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                        <input
                          type="url"
                          name="companyWebsite"
                          value={form.companyWebsite}
                          onChange={handleChange}
                          placeholder="https://example.com"
                          className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-black mb-2">
                        Your Job Title
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                        <input
                          type="text"
                          name="jobTitle"
                          value={form.jobTitle}
                          onChange={handleChange}
                          placeholder="e.g. HR Manager"
                          className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-black mb-2">
                        Industry
                      </label>
                      <div className="relative">
                        <Factory className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                        <select
                          name="industry"
                          value={form.industry}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50 appearance-none cursor-pointer"
                        >
                          <option value="">Select industry</option>
                          <option value="tech">Technology</option>
                          <option value="finance">Finance</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="education">Education</option>
                          <option value="retail">Retail</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-black mb-2">
                        Company Size
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                        <select
                          name="companySize"
                          value={form.companySize}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50 appearance-none cursor-pointer"
                        >
                          <option value="">Select company size</option>
                          <option value="1-10 employees">1–10 employees</option>
                          <option value="11-50 employees">
                            11–50 employees
                          </option>
                          <option value="51-200 employees">
                            51–200 employees
                          </option>
                          <option value="201-500 employees">
                            201–500 employees
                          </option>
                          <option value="500+ employees">500+ employees</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-black mb-2">
                        Company Logo{" "}
                        <span className="text-gray-600 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <div className="flex items-center gap-3 border-2 border-black rounded-xl p-3 bg-gray-50">
                        <div className="w-12 h-12 rounded-xl bg-orange-300 border-2 border-black flex items-center justify-center overflow-hidden shrink-0">
                          <ImageIcon className="w-6 h-6 text-black" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-black truncate">
                            {form.companyLogo
                              ? form.companyLogo.name
                              : "Upload logo"}
                          </p>
                        </div>
                        <label className="px-4 py-2 bg-orange-400 text-black text-sm font-black rounded-lg cursor-pointer border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all shrink-0">
                          Browse
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFile(e, "companyLogo")}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-black font-black rounded-2xl text-base border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-2 ${
                  isApplicant ? "bg-purple-500" : "bg-cyan-400"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-4 border-black/30 border-t-black rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : isApplicant ? (
                  "Create Applicant Account"
                ) : (
                  "Create Recruiter Account"
                )}
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
