// src/pages/JobDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Mail,
  Globe,
  Briefcase,
  CheckCircle,
  AlertCircle,
  XCircle,
  Archive,
  Loader2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchJobById, 
  toggleBookmark, 
  applyToJob, 
  withdrawFromJob, 
  toggleArchiveJob 
} from "../redux/slices/jobSlice";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import AIHiringAssistant from "../components/AIHiringAssistant";
import InterviewPreparation from "../components/InterviewPreparation";
import {toast, ToastContainer} from "react-toastify"

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentJob, isLoading, error } = useSelector((state) => state.jobs);
  
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId));
    }
  }, [jobId, dispatch]);

  useEffect(() => {
    if (currentJob?.category) {
      const fetchSimilar = async () => {
        try {
          const res = await api.get(`/jobs?category=${encodeURIComponent(currentJob.category)}&limit=3`);
          const filtered = (res.data.jobs || []).filter((j) => j._id !== jobId);
          setSimilarJobs(filtered.slice(0, 3));
        } catch (err) {
          console.error("Failed to fetch similar jobs:", err);
        }
      };
      fetchSimilar();
    }
  }, [currentJob, jobId]);

  const handleToggleArchive = async () => {
    setIsActionLoading(true);
    try {
      await dispatch(toggleArchiveJob(jobId)).unwrap();
      currentJob.isActive ? toast.success("Job is now archived") : toast.success("Job is now unarchived");
    } catch (err) {
      console.error(err);
      currentJob.isActive ? toast.error("Failed to archive") : toast.error("Failed to unarchive")
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleApply = async () => {
    setIsActionLoading(true);
    try {
      await dispatch(applyToJob(jobId)).unwrap();
      toast.success("Applied!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setIsActionLoading(true);
    try {
      await dispatch(withdrawFromJob(jobId)).unwrap();
      toast.info("Application has been withdrawn");
    } catch (err) {
      console.error(err);
      toast.error("Failed to withdraw");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (isLoading) return;
    if (!user) return navigate("/login");
    setIsActionLoading(true);
    try {
      await dispatch(toggleBookmark(jobId)).unwrap();
      currentJob.isBookmarked ? toast.success("Unsaved the job") : toast.success("Job is bookmarked");
    } catch (err) {
      console.error(err);
      currentJob.isBookmarked ? toast.error("Failed to unsave") : toast.error("Failed to bookmark");
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatSalary = (min, max, currency = "USD", period = "year") => {
    return `${currency} ${Number(min).toLocaleString()} - ${Number(max).toLocaleString()} / ${period}`;
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-cyan-200 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-black animate-spin" />
            <span className="font-black text-black">Loading Job Details...</span>
          </div>
        </div>
      </>
    );
  }

  if (error && !currentJob) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-cyan-200 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center max-w-md">
            <div className="w-16 h-16 bg-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
              <AlertCircle className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-black text-black mb-2">Error Loading Job</h2>
            <p className="text-gray-700 mb-6 font-medium">{error}</p>
            <Link to="/jobs" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
              <ArrowLeft className="w-4 h-4" /> Back to Jobs
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!currentJob) return null;

  const isRecruiter = user?.role === "recruiter";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cyan-200">
        {/* ==================== HEADER ==================== */}
        <div className="bg-yellow-300 border-b-4 border-black top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-black bg-white px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Jobs
            </Link>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shrink-0 overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {currentJob.recruiter?.companyLogo ? (
                    <img src={currentJob.recruiter.companyLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-10 h-10 text-black" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-black leading-tight">{currentJob.title}</h1>
                  <p className="text-lg text-black font-bold mt-1">
                    {currentJob.recruiter?.companyName || currentJob.recruiter?.fullName || "Company"}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-200 text-black text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Globe className="w-4 h-4" /> {currentJob.workMode}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-200 text-black text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Clock className="w-4 h-4" /> {currentJob.employmentType}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-100 text-black text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <MapPin className="w-4 h-4" /> {currentJob.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Card (For Job Owner) */}
              {isRecruiter && (
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full md:w-80 shrink-0">
                  <h3 className="text-sm font-black text-black uppercase tracking-wide mb-4 border-b-4 border-black pb-2">Job Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleToggleArchive}
                      disabled={isActionLoading}
                      className={`w-full py-3 font-bold rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        currentJob.isActive
                          ? "bg-orange-300 text-black"
                          : "bg-green-400 text-black"
                      }`}
                    >
                      {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : currentJob.isActive ? (
                        <>
                          <Archive className="w-4 h-4" /> Archive Job
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" /> Unarchive Job
                        </>
                      )}
                    </button>

                    <Link to={`/jobs/${jobId}/edit`} className="w-full py-3 bg-white border-2 border-black text-black font-bold rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                      <Briefcase className="w-4 h-4" /> Edit Job Details
                    </Link>
                  </div>
                </div>
              )}

              {/* Action Card (For Applicant) */}
              {!isRecruiter && (
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full md:w-80 shrink-0">
                  <button
                    onClick={handleToggleBookmark}
                    disabled={isActionLoading || isLoading}
                    className={`w-full py-3 font-bold rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      currentJob.isBookmarked
                        ? "bg-yellow-300 text-black"
                        : "bg-white text-black hover:bg-gray-50"
                    }`}
                  >
                    {currentJob.isBookmarked ? (
                      <>
                        <BookmarkCheck className="w-5 h-5" /> Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-5 h-5" /> Save Job
                      </>
                    )}
                  </button>

                  <div className="border-t-4 border-black my-4"></div>
                  {currentJob.hasApplied ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-black bg-green-400 p-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-bold text-sm">{currentJob.applicationStatus}</span>
                      </div>
                      <button
                        onClick={handleWithdraw}
                        disabled={isActionLoading}
                        className="w-full py-3 border-2 border-black text-black font-bold rounded-xl bg-red-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        {isActionLoading ? "Processing..." : "Withdraw Application"}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleApply}
                      disabled={isActionLoading || !currentJob.isActive}
                      className="w-full py-4 bg-purple-500 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-2"
                    >
                      {isActionLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Briefcase className="w-5 h-5" /> Apply Now
                        </>
                      )}
                    </button>
                  )}
                  {!currentJob.isActive && (
                    <p className="text-xs text-center text-black font-bold mt-3 bg-red-400 px-3 py-1.5 rounded-lg border-2 border-black inline-block w-full">
                      This job is no longer accepting applications.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================== MAIN CONTENT ==================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-xl font-black text-black mb-6 flex items-center gap-2 border-b-4 border-black pb-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center border-2 border-black">
                    <Briefcase className="w-5 h-5 text-black" />
                  </div>
                  Job Description
                </h2>
                <div className="prose prose-gray max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed font-medium">
                  {currentJob.description}
                </div>
              </div>

              {/* Required Skills */}
              {currentJob.skills && currentJob.skills.trim() !== "" && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h2 className="text-xl font-black text-black mb-6 flex items-center gap-2 border-b-4 border-black pb-3">
                    <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center border-2 border-black">
                      <CheckCircle className="w-5 h-5 text-black" />
                    </div>
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {currentJob.skills.split(",").map((skill, idx) => (
                      <span key={idx} className="px-4 py-2 bg-orange-200 text-black text-sm font-bold rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Compensation & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-xs font-black text-black uppercase tracking-wide mb-3 bg-gray-100 inline-block px-3 py-1 rounded-lg border-2 border-black">Compensation</h3>
                  <div className="flex items-center gap-3 text-black mt-2">
                    <div className="w-10 h-10 bg-green-400 rounded-xl flex items-center justify-center border-2 border-black">
                      <DollarSign className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-lg font-black">
                      {formatSalary(currentJob.salary.min, currentJob.salary.max, currentJob.salary.currency, currentJob.salary.period)}
                    </span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-xs font-black text-black uppercase tracking-wide mb-3 bg-gray-100 inline-block px-3 py-1 rounded-lg border-2 border-black">Experience</h3>
                  <div className="flex items-center gap-3 text-black mt-2">
                    <div className="w-10 h-10 bg-blue-300 rounded-xl flex items-center justify-center border-2 border-black">
                      <Clock className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-lg font-black">
                      {currentJob.experience.min === 0 && currentJob.experience.max === 0
                        ? "Any experience level"
                        : `${currentJob.experience.min} - ${currentJob.experience.max} years`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Recruiter Info Card */}
              <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xs font-black text-black uppercase tracking-wide mb-4 bg-gray-100 inline-block px-3 py-1 rounded-lg border-2 border-black">Posted By</h3>
                <div className="flex items-center gap-4 mb-4 mt-2">
                  <div className="w-14 h-14 rounded-full bg-purple-300 flex items-center justify-center text-black font-black text-xl shrink-0 border-2 border-black">
                    {currentJob.recruiter?.fullName?.charAt(0) || "R"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-black truncate text-lg">{currentJob.recruiter?.fullName || "Recruiter"}</p>
                    <p className="text-sm text-gray-600 font-bold truncate">{currentJob.recruiter?.companyName || "Company"}</p>
                  </div>
                </div>
                {currentJob.recruiter?.email && (
                  <a href={`mailto:${currentJob.recruiter.email}`} className="flex items-center gap-2 text-sm font-bold text-black bg-blue-200 px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all break-all">
                    <Mail className="w-4 h-4 shrink-0" /> {currentJob.recruiter.email}
                  </a>
                )}
              </div>

              {/* AI Interview Preparation (For Applicant) */}
              {!isRecruiter && (
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <InterviewPreparation jobId={jobId} jobTitle={currentJob.title} />
                </div>
              )}

              {/* AI Hiring Assistant (For Job Owner) */}
              {isRecruiter && (
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <AIHiringAssistant jobId={jobId} />
                </div>
              )}

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-xs font-black text-black uppercase tracking-wide mb-4 bg-gray-100 inline-block px-3 py-1 rounded-lg border-2 border-black">Similar Jobs</h3>
                  <div className="space-y-4 mt-2">
                    {similarJobs.map((simJob) => (
                      <Link key={simJob._id} to={`/jobs/${simJob._id}`} className="block p-4 rounded-xl border-2 border-black bg-gray-50 hover:bg-purple-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
                        <h4 className="font-black text-black text-sm group-hover:text-purple-600 line-clamp-1">{simJob.title}</h4>
                        <p className="text-xs text-gray-600 font-bold mt-1">{simJob.recruiter?.companyName || "Company"}</p>
                        <div className="flex items-center gap-3 mt-3 text-xs font-bold text-black">
                          <span className="flex items-center gap-1 bg-cyan-200 px-2 py-1 rounded-lg border-2 border-black">
                            <MapPin className="w-3 h-3" /> {simJob.location}
                          </span>
                          <span className="flex items-center gap-1 bg-green-200 px-2 py-1 rounded-lg border-2 border-black">
                            <DollarSign className="w-3 h-3" /> {simJob.salary.currency} {Number(simJob.salary.min).toLocaleString()}+
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
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