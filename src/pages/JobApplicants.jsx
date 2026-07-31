// src/pages/JobApplicants.jsx
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Briefcase,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  MapPin,
  Globe,
  FileText,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllApplicants, updateApplicantStatus } from "../redux/slices/applicationSlice";
import Navbar from "../components/Navbar";
import {toast, ToastContainer} from "react-toastify"

export default function JobApplicants() {
  const dispatch = useDispatch();
  
  const { allApplicants, isLoading } = useSelector((state) => state.applications);
  const { user } = useSelector((state) => state.auth);
  
  const [filter, setFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllApplicants());
  }, [dispatch]);

  const handleStatusUpdate = async (applicationId, jobId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      await dispatch(updateApplicantStatus({ applicationId, jobId, newStatus })).unwrap();
      toast.success("Status got updated");
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update application status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplicants = allApplicants.filter(
    (app) => filter === "All" || app.status === filter,
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-green-400 text-black border-2 border-black";
      case "Rejected":
        return "bg-red-400 text-black border-2 border-black";
      default:
        return "bg-blue-300 text-black border-2 border-black";
    }
  };

  if (user?.role === "applicant") {
    return <Navigate to="/applicant/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-yellow-300 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-black animate-spin" />
            <span className="font-black text-black">Loading Applicants...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-yellow-300 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/recruiter/dashboard"
                className="p-3 rounded-xl border-2 border-black bg-white hover:bg-gray-50 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
              >
                <ArrowLeft className="w-5 h-5 text-black" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-black flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center border-2 border-black">
                    <Users className="w-6 h-6 text-black" />
                  </div>
                  All Applicants
                </h1>
                <p className="text-gray-700 text-sm mt-1 font-medium">
                  Manage applications across all your posted jobs.
                </p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {["All", "Applied", "Shortlisted", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 border-2 border-black ${
                  filter === tab
                    ? "bg-purple-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black hover:bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
                }`}
              >
                {tab}{" "}
                {tab !== "All" &&
                  `(${allApplicants.filter((a) => a.status === tab).length})`}
              </button>
            ))}
          </div>

          {/* Applicants List */}
          {filteredApplicants.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
              <div className="w-20 h-20 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
                <Users className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-xl font-black text-black mb-2">
                No applicants found
              </h3>
              <p className="text-gray-700 font-medium max-w-md mx-auto">
                {filter === "All"
                  ? "No one has applied to your jobs yet."
                  : `No applicants with "${filter}" status.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplicants.map((item) => {
                const applicant = item.applicant;
                const isUpdating = updatingId === item._id;
                const firstLetter = applicant?.fullName ? applicant.fullName.trim().charAt(0).toUpperCase() : "U";

                return (
                  <div
                    key={item._id}
                    className="bg-white p-5 sm:p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      {/* Left: User Info & Job Title */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-14 h-14 rounded-full bg-purple-300 flex items-center justify-center text-black font-black text-xl shrink-0 overflow-hidden border-2 border-black">
                          {applicant?.profileImage ? (
                            <img src={applicant.profileImage} alt={applicant.fullName} className="w-full h-full object-cover" />
                          ) : (
                            firstLetter
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-black text-black truncate">
                              {applicant?.fullName || "Unknown User"}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getStatusBadge(item.status)}`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border-2 border-black">
                              <Mail className="w-3.5 h-3.5 text-black" />
                              <span className="text-sm font-bold text-black truncate">
                                {applicant?.email || "No email"}
                              </span>
                            </div>
                            {applicant?.resume && (
                              <a
                                href={applicant.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
                              >
                                <FileText className="w-3.5 h-3.5" /> Resume
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-purple-600 mt-3 bg-purple-100 px-3 py-1.5 rounded-lg border-2 border-black">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span className="truncate">
                              Applied for: {item.jobTitle}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Details (Job Info, Date) */}
                      <div className="flex flex-wrap gap-3 lg:justify-center">
                        <div className="flex items-center gap-1.5 bg-orange-100 px-3 py-1.5 rounded-lg border-2 border-black">
                          <Globe className="w-4 h-4 text-black" />
                          <span className="text-xs font-bold text-black">{item.workMode || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-cyan-100 px-3 py-1.5 rounded-lg border-2 border-black">
                          <MapPin className="w-4 h-4 text-black" />
                          <span className="text-xs font-bold text-black">{item.location || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-green-100 px-3 py-1.5 rounded-lg border-2 border-black">
                          <Calendar className="w-4 h-4 text-black" />
                          <span className="text-xs font-bold text-black">Applied {formatDate(item.appliedAt)}</span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-3 lg:justify-end shrink-0">
                        {item.status !== "Shortlisted" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                item._id,
                                item.jobId,
                                "Shortlisted",
                              )
                            }
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-green-400 text-black border-2 border-black rounded-xl text-sm font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                          >
                            {isUpdating ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Shortlist
                          </button>
                        )}

                        {item.status !== "Rejected" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                item._id,
                                item.jobId,
                                "Rejected",
                              )
                            }
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-400 text-black border-2 border-black rounded-xl text-sm font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                          >
                            {isUpdating ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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