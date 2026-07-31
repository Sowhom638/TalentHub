// src/pages/EditProfile.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  MapPin,
  Tag,
  FileText,
  Briefcase,
  Building2,
  Globe,
  Users,
  Factory,
  Camera,
  X,
  Loader2,
  Save,
  ArrowLeft,
  ImageIcon,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../redux/slices/authSlice";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";

export default function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profilePreview, setProfilePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const hasInitialized = useRef(false);

  const [formData, setFormData] = useState({
    fullName: "",
    experience: "",
    location: "",
    skills: "",
    companyName: "",
    companyWebsite: "",
    jobTitle: "",
    companySize: "",
    industry: "",
    profileImage: null,
    resume: null,
    companyLogo: null,
  });

  useEffect(() => {
    if (user && !hasInitialized.current) {
      setFormData({
        fullName: user.fullName || "",
        experience: user.experience || "",
        location: user.location || "",
        skills: user.skills || "",
        companyName: user.companyName || "",
        companyWebsite: user.companyWebsite || "",
        jobTitle: user.jobTitle || "",
        companySize: user.companySize || "",
        industry: user.industry || "",
        profileImage: null,
        resume: null,
        companyLogo: null,
      });
      setProfilePreview(user.profileImage || null);
      setLogoPreview(user.companyLogo || null);

      hasInitialized.current = true;
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [key]: file });

    if (key === "profileImage" && file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
    if (key === "companyLogo" && file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (key) => {
    setFormData({ ...formData, [key]: null });
    if (key === "profileImage") setProfilePreview(user?.profileImage || null);
    if (key === "companyLogo") setLogoPreview(user?.companyLogo || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("fullName", formData.fullName);

    if (user.role === "applicant") {
      data.append("experience", formData.experience);
      data.append("location", formData.location);
      data.append("skills", formData.skills);

      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }
      if (formData.resume) {
        data.append("resume", formData.resume);
      }
    } else {
      data.append("companyName", formData.companyName);
      data.append("companyWebsite", formData.companyWebsite);
      data.append("jobTitle", formData.jobTitle);
      data.append("companySize", formData.companySize);
      data.append("industry", formData.industry);

      if (formData.companyLogo) {
        data.append("companyLogo", formData.companyLogo);
      }
    }

    try {
      await dispatch(updateProfile(data)).unwrap();
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-pink-200 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-black animate-spin" />
            <span className="font-black text-black">Loading Profile...</span>
          </div>
        </div>
      </>
    );
  }

  const isApplicant = user.role === "applicant";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-200 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="p-3 rounded-xl border-2 border-black bg-white hover:bg-gray-50 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-5 h-5 text-black" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-black">Edit Profile</h1>
              <p className="text-gray-700 text-sm mt-1 font-medium">
                Update your {isApplicant ? "professional" : "company"}{" "}
                information
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ===== READ-ONLY INFO ===== */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b-4 border-black">
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wide mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold bg-gray-200 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wide mb-2">
                    Account Type
                  </label>
                  <div className="relative">
                    {isApplicant ? (
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                    ) : (
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                    )}
                    <input
                      type="text"
                      value={isApplicant ? "Applicant" : "Recruiter"}
                      disabled
                      className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold bg-gray-200 text-gray-600 cursor-not-allowed capitalize"
                    />
                  </div>
                </div>
              </div>

              {/* ===== FULL NAME (Common) ===== */}
              <div>
                <label className="block text-sm font-black text-black mb-2">
                  {isApplicant ? "Full Name" : "Your Full Name"}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                  />
                </div>
              </div>

              {/* ===== APPLICANT FIELDS ===== */}
              {isApplicant && (
                <>
                  {/* Profile Image */}
                  <div>
                    <label className="block text-sm font-black text-black mb-3 text-center">
                      Profile Photo
                    </label>
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-cyan-400 border-4 border-black flex items-center justify-center overflow-hidden transition-all">
                          {profilePreview ? (
                            <img
                              src={profilePreview}
                              alt="Preview"
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
                        {profilePreview && formData.profileImage && (
                          <button
                            type="button"
                            onClick={() => removeFile("profileImage")}
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
                            onChange={(e) =>
                              handleFileChange(e, "profileImage")
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-xs font-bold text-gray-600 bg-yellow-200 px-3 py-1 rounded-lg border-2 border-black">
                        {formData.profileImage
                          ? formData.profileImage.name
                          : "JPG, PNG or GIF • Max 2MB"}
                      </p>
                    </div>
                  </div>

                  {/* Experience, Location, Skills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-black mb-2">
                        Experience
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50 appearance-none cursor-pointer"
                      >
                        <option value="">Select experience</option>
                        <option value="fresher">Fresher</option>
                        <option value="1-2 years">1–2 years</option>
                        <option value="3-5 years">3–5 years</option>
                        <option value="5+ years">5+ years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-black mb-2">
                        Current Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. New York, NY"
                          className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                        />
                      </div>
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
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="e.g. React, Node.js, SQL (comma separated)"
                        className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Resume */}
                  <div>
                    <label className="block text-sm font-black text-black mb-2">
                      Resume{" "}
                      <span className="text-gray-600 font-normal">
                        (Leave blank to keep current)
                      </span>
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-2 border-black rounded-xl p-3 bg-gray-50">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-purple-200 rounded-lg border-2 border-black flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-black" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-black truncate">
                            {formData.resume
                              ? formData.resume.name
                              : user.resume
                                ? "Current resume on file"
                                : "Upload new resume"}
                          </p>
                          <p className="text-xs text-gray-600 font-medium">
                            PDF, DOC or DOCX (Max 5MB)
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {user.resume && !formData.resume && (
                          <a
                            href={user.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-white border-2 border-black text-black text-sm font-bold rounded-lg hover:bg-gray-50 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
                          >
                            View Current
                          </a>
                        )}
                        <label className="px-5 py-2 bg-purple-500 text-white text-sm font-black rounded-lg cursor-pointer border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all text-center">
                          Browse
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange(e, "resume")}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ===== RECRUITER FIELDS ===== */}
              {!isApplicant && (
                <>
                  {/* Company Name & Website */}
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
                          value={formData.companyName}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-black mb-2">
                        Company Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                        <input
                          type="url"
                          name="companyWebsite"
                          value={formData.companyWebsite}
                          onChange={handleChange}
                          placeholder="https://example.com"
                          className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Job Title & Industry */}
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
                          value={formData.jobTitle}
                          onChange={handleChange}
                          required
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
                          value={formData.industry}
                          onChange={handleChange}
                          required
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

                  {/* Company Size & Logo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-black mb-2">
                        Company Size
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                        <select
                          name="companySize"
                          value={formData.companySize}
                          onChange={handleChange}
                          required
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
                        Company Logo
                      </label>
                      <div className="flex items-center gap-3 border-2 border-black rounded-xl p-3 bg-gray-50">
                        <div className="w-12 h-12 rounded-xl bg-orange-300 border-2 border-black flex items-center justify-center overflow-hidden shrink-0">
                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-black" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-black truncate">
                            {formData.companyLogo
                              ? formData.companyLogo.name
                              : user.companyLogo
                                ? "Current logo on file"
                                : "Upload new logo"}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {logoPreview && formData.companyLogo && (
                            <button
                              type="button"
                              onClick={() => removeFile("companyLogo")}
                              className="p-2 bg-red-400 border-2 border-black rounded-lg text-black hover:bg-red-500 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          <label className="px-4 py-2 bg-orange-400 text-black text-sm font-black rounded-lg cursor-pointer border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
                            Browse
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileChange(e, "companyLogo")
                              }
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-6 border-t-4 border-black">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 text-black font-black rounded-2xl text-base border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-3 ${isApplicant ? "bg-purple-500" : "bg-green-500"}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-black" />{" "}
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6 text-black" /> Save Profile
                      Changes
                    </>
                  )}
                </button>
              </div>
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
    </>
  );
}
