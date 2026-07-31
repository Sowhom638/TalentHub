// src/pages/ApplicantApplications.jsx
import { useEffect } from "react";
import { useSearchParams, Link, Navigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Building2,
  Clock,
  ExternalLink,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchApplications, withdrawApplication } from "../redux/slices/applicationSlice";
import Navbar from "../components/Navbar";

export default function ApplicantApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "Applied";
  const currentPage = Number(searchParams.get("page")) || 1;

  const dispatch = useDispatch();
  
  const { applications, pagination, isLoading, error } = useSelector((state) => state.applications);
  const { user } = useSelector((state) => state.auth);

  const statuses = ["Applied", "Shortlisted", "Rejected", "Hired"];

  useEffect(() => {
    dispatch(fetchApplications({ status: currentStatus, page: currentPage, limit: 10 }));
  }, [dispatch, currentStatus, currentPage]);

  const handleStatusChange = (status) => {
    const newParams = new URLSearchParams(searchParams);
    if (status === "All") {
      newParams.delete("status");
    } else {
      newParams.set("status", status);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage);
    setSearchParams(newParams);
  };

  const handleWithdraw = async (jobId) => {
    if (
      !window.confirm(
        "Are you sure you want to withdraw your application? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await dispatch(withdrawApplication(jobId)).unwrap();
    } catch (err) {
      console.error("Failed to withdraw:", err);
      alert("Failed to withdraw application. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Applied: "bg-blue-300 text-black border-2 border-black",
      Shortlisted: "bg-green-400 text-black border-2 border-black",
      Rejected: "bg-red-400 text-black border-2 border-black",
      Hired: "bg-purple-400 text-black border-2 border-black",
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${styles[status] || "bg-gray-200 text-black border-2 border-black"}`}
      >
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
            <h2 className="text-xl font-black text-black mb-2">
              Error Loading Applications
            </h2>
            <p className="text-gray-700 mb-6 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-400 text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
            >
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
        <div className="max-w-5xl mx-auto space-y-6">
          {/* ==================== HEADER ==================== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-black">
                My Applications
              </h1>
              <p className="text-gray-700 mt-1 font-medium">
                Track and manage your job applications.
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
            >
              <Briefcase className="w-5 h-5" />
              Browse Jobs
            </Link>
          </div>

          {/* ==================== STATUS TABS ==================== */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 border-2 border-black ${
                  currentStatus === status
                    ? "bg-purple-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black hover:bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
                }`}
              >
                {status}
                {status === "All" && pagination.totalApplications > 0 && (
                  <span className="ml-1.5 text-xs opacity-80">
                    ({pagination.totalApplications})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ==================== APPLICATIONS LIST ==================== */}
          <div className="space-y-4">
            {isLoading ? (
              // Skeleton Loaders
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-xl border-2 border-black"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3 border-2 border-black"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4 border-2 border-black"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 border-2 border-black"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : applications.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-12 text-center">
                <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                  <Briefcase className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-black text-black mb-2">
                  {currentStatus === "All"
                    ? "No applications yet"
                    : `No ${currentStatus.toLowerCase()} applications`}
                </h3>
                <p className="text-gray-700 mb-6 max-w-sm mx-auto font-medium">
                  {currentStatus === "All"
                    ? "Start exploring and apply to jobs to see them tracked here."
                    : `You don't have any applications with the status "${currentStatus}".`}
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
                >
                  Browse Jobs
                </Link>
              </div>
            ) : (
              // Application Cards
              applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Company Logo */}
                    <div className="shrink-0 w-14 h-14 rounded-xl bg-cyan-400 flex items-center justify-center overflow-hidden border-2 border-black">
                      {app.job?.recruiter?.companyLogo ? (
                        <img
                          src={app.job.recruiter.companyLogo}
                          alt={app.job.recruiter.companyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-7 h-7 text-black" />
                      )}
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-black text-black truncate">
                            {app.job?.title || "Unknown Job Title"}
                          </h3>
                          <p className="text-sm text-gray-700 font-bold">
                            {app.job?.recruiter?.companyName ||
                              "Unknown Company"}
                          </p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="flex items-center gap-1.5 bg-purple-100 px-3 py-1.5 rounded-lg border-2 border-black text-xs font-bold text-black">
                          <MapPin className="w-3.5 h-3.5" />
                          {app.job?.location || "Location not specified"}
                        </span>
                        <span className="flex items-center gap-1.5 bg-cyan-100 px-3 py-1.5 rounded-lg border-2 border-black text-xs font-bold text-black">
                          <Briefcase className="w-3.5 h-3.5" />
                          {app.job?.workMode || "Work mode not specified"}
                        </span>
                        <span className="flex items-center gap-1.5 bg-orange-100 px-3 py-1.5 rounded-lg border-2 border-black text-xs font-bold text-black">
                          <Clock className="w-3.5 h-3.5" />
                          Applied {formatDate(app.appliedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-3 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t-2 border-black sm:border-t-0 sm:border-none">
                      <Link
                        to={`/jobs/${app.jobId}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-black bg-white rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
                      >
                        View Job <ExternalLink className="w-4 h-4" />
                      </Link>

                      {app.status === "Applied" && (
                        <button
                          onClick={() => handleWithdraw(app.jobId)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-black bg-red-400 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
                        >
                          Withdraw <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ==================== PAGINATION ==================== */}
          {!isLoading &&
            applications.length > 0 &&
            pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-4 border-black">
                <p className="text-sm text-black font-bold">
                  Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
                  {Math.min(
                    pagination.currentPage * 10,
                    pagination.totalApplications,
                  )}{" "}
                  of {pagination.totalApplications} results
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="p-2 rounded-xl border-2 border-black bg-white text-black font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="p-2 rounded-xl border-2 border-black bg-white text-black font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
}