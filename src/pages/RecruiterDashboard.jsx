// src/pages/RecruiterDashboard.jsx
import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchRecruiterDashboard } from "../redux/slices/jobSlice";
import {
  Briefcase,
  Archive,
  Users,
  Star,
  Plus,
  Calendar,
  MapPin,
  ChevronRight,
  Building2,
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function RecruiterDashboard() {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { stats, recentApplications, isLoading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchRecruiterDashboard());
  }, [dispatch]);

  const statCards = [
    { title: "Active Jobs", value: stats.activeJobs, icon: Briefcase, color: "bg-blue-300", link: "/jobs?isActive=true" },
    { title: "Archived Jobs", value: stats.archivedJobs, icon: Archive, color: "bg-gray-200", link: "/jobs?isActive=false" },
    { title: "Total Applications", value: stats.totalApplications, icon: Users, color: "bg-purple-300", link: "/applicants" },
    { title: "Shortlisted", value: stats.totalShortlisted, icon: Star, color: "bg-orange-300", link: "/applicants?status=Shortlisted" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Shortlisted": return "bg-green-400 text-black border-2 border-black";
      case "Rejected": return "bg-red-400 text-black border-2 border-black";
      case "Hired": return "bg-blue-300 text-black border-2 border-black";
      default: return "bg-gray-200 text-black border-2 border-black";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (user?.role === "applicant") {
    return <Navigate to="/applicant/dashboard" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cyan-200 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* ==================== HEADER ==================== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-black">Dashboard</h1>
              <p className="text-gray-700 mt-1 font-medium">Manage your job postings and track candidate applications.</p>
            </div>
            <Link to="/createjob" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
              <Plus className="w-5 h-5" /> Post a New Job
            </Link>
          </div>

          {/* ==================== SUMMARY CARDS ==================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* ==================== RECENT APPLICATIONS ==================== */}
          <div className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="p-6 border-b-4 border-black bg-cyan-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-black flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center border-2 border-black">
                  <Users className="w-5 h-5 text-black" />
                </div>
                Recent Applications
              </h2>
              <Link to="/applicants" className="text-sm font-black text-black bg-white px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl border-2 border-black animate-pulse"></div>
                ))}
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-purple-300 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
                  <Users className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-xl font-black text-black mb-2">No applications yet</h3>
                <p className="text-gray-700 font-medium max-w-md mx-auto">Applications will appear here once candidates apply to your jobs.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 border-b-4 border-black">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-black uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-4 text-xs font-black text-black uppercase tracking-wider">Job Title</th>
                      <th className="px-6 py-4 text-xs font-black text-black uppercase tracking-wider">Applied Date</th>
                      <th className="px-6 py-4 text-xs font-black text-black uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black">
                    {recentApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-black font-black text-sm border-2 border-black">
                              {app.applicant?.fullName?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="text-sm font-black text-black">{app.applicant?.fullName || "Unknown Candidate"}</p>
                              <p className="text-xs text-gray-600 font-medium">{app.applicant?.email || "No email"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-black text-black">{app.jobTitle}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-black mt-1">
                            <span className="flex items-center gap-1 bg-cyan-200 px-2 py-1 rounded-lg border-2 border-black">
                              <Building2 className="w-3 h-3" /> {app.workMode}
                            </span>
                            <span className="flex items-center gap-1 bg-orange-200 px-2 py-1 rounded-lg border-2 border-black">
                              <MapPin className="w-3 h-3" /> {app.location}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-black bg-gray-100 px-3 py-1.5 rounded-lg border-2 border-black w-fit">
                            <Calendar className="w-4 h-4" />
                            {formatDate(app.appliedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}