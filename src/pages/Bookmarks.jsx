import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Bookmark,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Globe,
  Trash2,
  Loader2,
} from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);
  
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await api.get("/bookmarks");
        setBookmarks(res.data);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleRemove = async (jobId) => {
    setRemovingId(jobId);
    try {
      await api.post(`/bookmarks/${jobId}`);
      setBookmarks((prev) => prev.filter((job) => job._id !== jobId));
      toast.success("Removed from the bookmark");
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
      toast.error("Failed to remove bookmark. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return "Salary not specified";
    const { min, max, currency = "USD", period = "year" } = salary;
    return `${currency} ${Number(min).toLocaleString()} - ${Number(max).toLocaleString()} / ${period}`;
  };
  
  if (user?.role === "recruiter") {
    return <Navigate to="/recruiter/dashboard" replace />;
  }
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-yellow-300 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-black flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center border-2 border-black">
                  <Bookmark className="w-6 h-6 text-black" fill="currentColor" />
                </div>
                Saved Jobs
              </h1>
              <p className="text-gray-700 mt-1 font-medium">
                {bookmarks.length} jobs saved
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
            >
              ← Browse more jobs
            </Link>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse h-48"
                ></div>
              ))}
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
              <div className="w-20 h-20 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
                <Bookmark className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-xl font-black text-black mb-2">
                No saved jobs yet
              </h3>
              <p className="text-gray-700 mb-8 font-medium max-w-md mx-auto">
                Bookmark jobs you're interested in to find them easily later.
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
              >
                Find Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((job) => (
                <div
                  key={job._id}
                  className="group bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 relative"
                >
                  {/* Remove Button (Top Right) */}
                  <button
                    onClick={() => handleRemove(job._id)}
                    disabled={removingId === job._id}
                    className="absolute top-4 right-4 p-3 bg-red-400 text-black rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove from bookmarks"
                  >
                    {removingId === job._id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pr-14">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-14 h-14 rounded-xl bg-cyan-400 flex items-center justify-center shrink-0 overflow-hidden border-2 border-black">
                          {job.recruiter?.companyLogo ? (
                            <img
                              src={job.recruiter.companyLogo}
                              alt="Logo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-7 h-7 text-black" />
                          )}
                        </div>
                        <div>
                          <Link
                            to={`/jobs/${job._id}`}
                            className="text-xl font-black text-black group-hover:text-purple-600 transition-colors"
                          >
                            {job.title}
                          </Link>
                          <p className="text-sm text-gray-700 font-bold mt-1">
                            {job.recruiter?.companyName ||
                              job.recruiter?.fullName ||
                              "Company"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-200 text-black text-xs font-bold border-2 border-black">
                          <Globe className="w-3.5 h-3.5" /> {job.workMode}
                        </span>
                        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-200 text-black text-xs font-bold border-2 border-black">
                          <Clock className="w-3.5 h-3.5" /> {job.employmentType}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border-2 border-black">
                          <MapPin className="w-4 h-4 text-black" />
                          <span className="font-bold text-black truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border-2 border-black">
                          <DollarSign className="w-4 h-4 text-black" />
                          <span className="font-bold text-black">{formatSalary(job.salary)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 mt-4 sm:mt-0">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="px-6 py-3 bg-purple-500 text-white text-sm font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all whitespace-nowrap"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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