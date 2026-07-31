// src/pages/ApplicantDashboard.jsx
import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Bookmark,
  Clock,
  MapPin,
  Building2,
  ChevronRight,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchApplicantDashboard } from "../redux/slices/applicationSlice";
import Navbar from "../components/Navbar";

export default function ApplicantDashboard() {
  const dispatch = useDispatch();
  
  const appState = useSelector((state) => state.applications) || {};
  const { 
    stats = { appliedJobs: 0, shortlisted: 0, rejected: 0, bookmarked: 0 }, 
    recentActivity = [], 
    recommendedJobs = [], 
    isLoading = false, 
    error = null 
  } = appState;
  
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchApplicantDashboard());
  }, [dispatch]);

  const statCards = [
    {
      title: "Applied Jobs",
      value: stats.appliedJobs || 0,
      icon: Briefcase,
      color: "bg-blue-300",
      link: "/applications?status=Applied",
    },
    {
      title: "Shortlisted",
      value: stats.shortlisted || 0,
      icon: CheckCircle2,
      color: "bg-green-400",
      link: "/applications?status=Shortlisted",
    },
    {
      title: "Rejected",
      value: stats.rejected || 0,
      icon: XCircle,
      color: "bg-red-400",
      link: "/applications?status=Rejected",
    },
    {
      title: "Bookmarked",
      value: stats.bookmarked || 0,
      icon: Bookmark,
      color: "bg-orange-300",
      link: "/bookmarks",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "applied": return <Briefcase className="w-5 h-5 text-black" />;
      case "shortlisted": return <CheckCircle2 className="w-5 h-5 text-black" />;
      case "rejected": return <XCircle className="w-5 h-5 text-black" />;
      case "bookmarked": return <Bookmark className="w-5 h-5 text-black" />;
      case "hired": return <CheckCircle2 className="w-5 h-5 text-black" />;
      default: return <Clock className="w-5 h-5 text-black" />;
    }
  };

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case "applied": return `Applied for ${activity.jobTitle} at ${activity.companyName}`;
      case "shortlisted": return `Shortlisted for ${activity.jobTitle} at ${activity.companyName}`;
      case "rejected": return `Your application for ${activity.jobTitle} was rejected`;
      case "bookmarked": return `Bookmarked ${activity.jobTitle} at ${activity.companyName}`;
      case "hired": return `Congratulations! You were hired for ${activity.jobTitle}`;
      default: return activity.description || "Activity update";
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    return `${Math.floor(diffInDays / 30)}mo ago`;
  };

  const formatSalary = (min, max, currency = "USD") => {
    const symbols = { USD: "$", INR: "₹", EUR: "€", GBP: "£" };
    const symbol = symbols[currency] || "$";
    return `${symbol}${min} - ${symbol}${max}`;
  };

  if (user?.role === "recruiter") {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-yellow-300 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-black text-black mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-700 mb-6 font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-400 text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-yellow-300 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* ==================== HEADER ==================== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-black">My Dashboard</h1>
              <p className="text-gray-700 mt-1 font-medium">Track your applications and discover new opportunities.</p>
            </div>
            <Link to="/jobs" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
              <Briefcase className="w-5 h-5" /> Browse Jobs
            </Link>
          </div>

          {/* ==================== SUMMARY CARDS ==================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                    <div className="h-12 w-12 bg-gray-200 rounded-xl border-2 border-black mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 border-2 border-black"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 border-2 border-black"></div>
                  </div>
                ))
              : statCards.map((card, idx) => (
                  <Link key={idx} to={card.link} className="group bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200">
                    <div className={`w-14 h-14 rounded-xl ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border-2 border-black`}>
                      <card.icon className="w-7 h-7 text-black" />
                    </div>
                    <p className="text-sm font-bold text-gray-600 mb-1">{card.title}</p>
                    <p className="text-3xl font-black text-black">{card.value}</p>
                  </Link>
                ))}
          </div>

          {/* ==================== MAIN CONTENT GRID ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ==================== RECENT ACTIVITY ==================== */}
            <div className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="p-6 border-b-4 border-black flex items-center justify-between bg-cyan-100">
                <h2 className="text-lg font-black text-black flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Recent Activity
                </h2>
                <Link to="/applications" className="text-sm font-bold text-black bg-white px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-black animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4 border-2 border-black animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4 border-2 border-black animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                    <Clock className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-lg font-black text-black mb-2">No recent activity</h3>
                  <p className="text-gray-700 font-medium">Start applying to jobs to see your activity here.</p>
                </div>
              ) : (
                <div className="divide-y-2 divide-black">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-4">
                        <div className="shrink-0 w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center border-2 border-black">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-black">{getActivityMessage(activity)}</p>
                          <p className="text-xs text-gray-600 mt-1 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" /> {formatTimeAgo(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ==================== RECOMMENDED JOBS ==================== */}
            <div className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="p-6 border-b-4 border-black flex items-center justify-between bg-orange-200">
                <h2 className="text-lg font-black text-black flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Recommended Jobs
                </h2>
                <Link to="/jobs" className="text-sm font-bold text-black bg-white px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-2 border-black rounded-xl p-4 animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl border-2 border-black"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/2 border-2 border-black"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4 border-2 border-black"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4 border-2 border-black"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendedJobs.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-purple-300 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                    <Briefcase className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-lg font-black text-black mb-2">No recommendations yet</h3>
                  <p className="text-gray-700 mb-6 font-medium">Complete your profile to get personalized job recommendations.</p>
                  <Link to="/profile" className="text-black font-bold bg-cyan-400 px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all inline-block">Update Profile</Link>
                </div>
              ) : (
                <div className="divide-y-2 divide-black">
                  {recommendedJobs.map((job) => (
                    <Link key={job._id} to={`/jobs/${job._id}`} className="block p-6 hover:bg-gray-50 transition-colors group">
                      <div className="flex gap-4">
                        <div className="shrink-0 w-14 h-14 rounded-xl bg-cyan-400 flex items-center justify-center overflow-hidden border-2 border-black">
                          {job.recruiter?.companyLogo ? (
                            <img src={job.recruiter.companyLogo} alt={job.recruiter.companyName} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-7 h-7 text-black" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-black text-black group-hover:text-purple-600 transition-colors">{job.title}</h3>
                          <p className="text-sm text-gray-700 font-bold mt-0.5">{job.recruiter?.companyName || "Company"}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <span className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-lg border-2 border-black font-bold text-black"><MapPin className="w-3 h-3" />{job.location}</span>
                            <span className="flex items-center gap-1 bg-cyan-100 px-2 py-1 rounded-lg border-2 border-black font-bold text-black"><Briefcase className="w-3 h-3" />{job.workMode}</span>
                          </div>
                          <p className="text-sm font-black text-black mt-3 bg-orange-100 inline-block px-3 py-1 rounded-lg border-2 border-black">
                            {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}