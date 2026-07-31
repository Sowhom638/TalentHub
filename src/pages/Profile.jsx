// src/pages/Profile.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../redux/slices/authSlice";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Tag,
  FileText,
  Building2,
  Globe,
  Users,
  Factory,
  ArrowLeft,
  Loader2,
  Download,
  Edit3
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function Profile() {
  const dispatch = useDispatch();
  
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && !isLoading) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, isLoading]);

  if (isLoading) {
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

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-pink-200 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center max-w-md">
            <div className="w-16 h-16 bg-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
              <User className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-black text-black mb-2">User not found</h2>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all mt-2"
            >
              Please log in
            </Link>
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <Link
              to={isApplicant ? "/applicant/dashboard" : "/recruiter/dashboard"}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black font-bold rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <Link
              to="/editprofile"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500 text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </Link>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden">
            {/* Decorative Banner */}
            <div
              className={`h-32 sm:h-40 ${isApplicant ? "bg-linear-to-r from-purple-400 to-pink-400" : "bg-linear-to-r from-cyan-400 to-blue-400"} border-b-4 border-black`}
            />

            <div className="px-6 sm:px-8 pb-8">
              {/* Profile Header */}
              <div className="relative flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 mb-6">
                <div
                  className={`w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 border-black flex items-center justify-center overflow-hidden shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white`}
                >
                  {isApplicant ? (
                    user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-14 h-14 text-black" />
                    )
                  ) : user.companyLogo ? (
                    <img
                      src={user.companyLogo}
                      alt={user.companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-14 h-14 text-black" />
                  )}
                </div>

                <div className="flex-1 pt-2 sm:pt-0 sm:pb-2">
                  <span className="text-3xl sm:text-4xl bg-yellow-300 border-2 px-2 py-1 rounded-lg border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black text-black leading-tight">
                    {isApplicant ? user.fullName : user.companyName}
                  </span>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {isApplicant ? (
                      <>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-300 text-black text-sm font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <Briefcase className="w-4 h-4" />{" "}
                          {user.experience || "Experience not specified"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-300 text-black text-sm font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <MapPin className="w-4 h-4" />{" "}
                          {user.location || "Location not specified"}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-400 text-black text-sm font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <Factory className="w-4 h-4" />{" "}
                          {user.industry || "Industry not specified"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-300 text-black text-sm font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <Users className="w-4 h-4" />{" "}
                          {user.companySize || "Company size not specified"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t-4 border-black pt-6">
                {isApplicant ? (
                  /* ==================== APPLICANT PROFILE ==================== */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-6">
                      <div className="bg-gray-50 p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-xs font-black text-black uppercase tracking-wide mb-3 flex items-center gap-2">
                          <Mail className="w-4 h-4" /> Contact
                        </h3>
                        <div className="flex items-center gap-3 text-black font-bold break-all">
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </div>
                      
                      {user.resume && (
                        <div>
                          <h3 className="text-xs font-black text-black uppercase tracking-wide mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Resume
                          </h3>
                          <a 
                            href={user.resume} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-3 p-4 bg-blue-300 text-black rounded-xl border-2 border-black hover:bg-blue-400 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 group"
                          >
                            <div className="w-10 h-10 bg-white rounded-lg border-2 border-black flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black truncate">View Resume</p>
                              <p className="text-xs font-bold text-black/70">PDF / DOCX</p>
                            </div>
                            <Download className="w-5 h-5 text-black group-hover:translate-y-0.5 transition-transform" />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-8">
                      <div>
                        <h3 className="text-xs font-black text-black uppercase tracking-wide mb-3 bg-gray-100 inline-block px-3 py-1.5 rounded-lg border-2 border-black">About / Bio</h3>
                        <p className="text-black font-medium leading-relaxed mt-2">
                          {user.bio || `Motivated ${user.experience || "professional"} based in ${user.location || "the area"}. Passionate about leveraging my skills in ${user.skills || "various technologies"} to contribute to innovative projects and drive meaningful results.`}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-xs font-black text-black uppercase tracking-wide mb-3 bg-gray-100 inline-block px-3 py-1.5 rounded-lg border-2 border-black">Skills</h3>
                        {user.skills ? (
                          <div className="flex flex-wrap gap-3 mt-2">
                            {user.skills.split(",").map((skill, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-200 text-black text-sm font-bold rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <Tag className="w-3.5 h-3.5" /> {skill.trim()}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-black font-bold italic bg-gray-100 p-3 rounded-xl border-2 border-black inline-block">No skills added yet.</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-xs font-black text-black uppercase tracking-wide mb-3 bg-gray-100 inline-block px-3 py-1.5 rounded-lg border-2 border-black">Experience & Education</h3>
                        <div className="space-y-4 mt-2">
                          <div className="flex gap-4 bg-white p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <div className="w-12 h-12 rounded-xl bg-purple-300 flex items-center justify-center shrink-0 border-2 border-black">
                              <Briefcase className="w-6 h-6 text-black" />
                            </div>
                            <div>
                              <h4 className="font-black text-black">Professional Experience</h4>
                              <p className="text-sm font-bold text-gray-700 mt-1">{user.experience || "Not specified"}</p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ==================== RECRUITER PROFILE ==================== */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-6">
                      <div className="bg-gray-50 p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-xs font-black text-black uppercase tracking-wide mb-3 flex items-center gap-2">
                          <User className="w-4 h-4" /> Contact
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-black font-bold">
                            <span className="text-sm">{user.fullName} <span className="text-gray-600">({user.jobTitle || "Recruiter"})</span></span>
                          </div>
                          <div className="flex items-center gap-3 text-black font-bold break-all">
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </div>
                      </div>
                      
                      {user.companyWebsite && (
                        <div>
                          <h3 className="text-xs font-black text-black uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Globe className="w-4 h-4" /> Website
                          </h3>
                          <a 
                            href={user.companyWebsite} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-3 p-4 bg-purple-200 text-black rounded-xl border-2 border-black hover:bg-purple-300 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 group"
                          >
                            <div className="w-10 h-10 bg-white rounded-lg border-2 border-black flex items-center justify-center shrink-0">
                              <Globe className="w-5 h-5 text-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black truncate">Visit Website</p>
                              <p className="text-xs font-bold text-black/70 truncate">{user.companyWebsite.replace(/^https?:\/\//, "")}</p>
                            </div>
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-8">
                      <div>
                        <h3 className="text-xs font-black text-black uppercase tracking-wide mb-3 bg-gray-100 inline-block px-3 py-1.5 rounded-lg border-2 border-black">About Company</h3>
                        <p className="text-black font-medium leading-relaxed mt-2">
                          {user.companyAbout || `${user.companyName} is a dynamic organization in the ${user.industry || "technology"} sector. We are dedicated to fostering innovation and building a world-class team to drive our mission forward. With a team of ${user.companySize || "growing professionals"}, we strive to create impactful solutions and provide an exceptional work environment.`}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 bg-green-300 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-white rounded-lg border-2 border-black flex items-center justify-center">
                              <Factory className="w-5 h-5 text-black" />
                            </div>
                            <h4 className="font-black text-black">Industry</h4>
                          </div>
                          <p className="text-sm font-bold text-black capitalize">{user.industry || "Not specified"}</p>
                        </div>
                        <div className="p-5 bg-cyan-300 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-white rounded-lg border-2 border-black flex items-center justify-center">
                              <Users className="w-5 h-5 text-black" />
                            </div>
                            <h4 className="font-black text-black">Company Size</h4>
                          </div>
                          <p className="text-sm font-bold text-black">{user.companySize || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}