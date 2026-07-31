// src/pages/EditJob.jsx
import { useEffect } from "react";
import {
  Briefcase,
  DollarSign,
  MapPin,
  Globe,
  Clock,
  Tag,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Calendar,
  LoaderCircle,
} from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobById, updateJob } from "../redux/slices/jobSlice";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";

export default function EditJob() {
  const params = useParams();
  const jobId = params.jobId || params.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentJob, isLoading, isSubmitting, error } = useSelector(
    (state) => state.jobs,
  );

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId));
    }
  }, [jobId, dispatch]);


  if (user?.role === "applicant") {
    return <Navigate to="/applicant/dashboard" replace />;
  }

  if (isLoading || !currentJob) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-blue-200">
          <div className="text-black font-bold flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <LoaderCircle className="animate-spin w-6 h-6 text-black" />
            Loading Job Details...
          </div>
        </div>
      </>
    );
  }


const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const title = String(formData.get("title") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const employmentType = formData.get("employmentType");
    const workMode = formData.get("workMode");
    const location = String(formData.get("location") || "").trim();
    
    // Robust number parsing to prevent NaN or string issues
    const parseNum = (val) => {
      if (val === "" || val === null || val === undefined) return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    };

    const experienceMin = parseNum(formData.get("experienceMin"));
    const experienceMax = parseNum(formData.get("experienceMax"));
    const salaryMin = parseNum(formData.get("salaryMin"));
    const salaryMax = parseNum(formData.get("salaryMax"));
    
    const currency = formData.get("currency");
    const period = formData.get("period");
    const description = String(formData.get("description") || "").trim();
    const skills = String(formData.get("skills") || "").trim();
    const expiryDate = formData.get("expiryDate");

    // Validation
    if (!title || !description || !location || !salaryMin || !salaryMax) {
      toast.error("Please fill in all required fields (Title, Description, Location, Salary).");
      return;
    }

    if (salaryMin > salaryMax) {
      toast.error("Minimum salary cannot be greater than maximum salary.");
      return;
    }
    if (experienceMin > experienceMax) {
      toast.error("Minimum experience cannot be greater than maximum experience.");
      return;
    }

    const payload = {
      title,
      category,
      employmentType,
      workMode,
      location,
      experience: {
        min: experienceMin,
        max: experienceMax,
      },
      salary: {
        min: salaryMin,
        max: salaryMax,
        currency,
        period,
      },
      skills,
      description,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
    };

    // 🔍 DEBUG: Check your browser console to see the exact payload being sent
    console.log("Submitting Payload:", payload);

    try {
      await dispatch(updateJob({ id: jobId, payload })).unwrap();
      toast.success("Job updated successfully!");
      setTimeout(() => {
        navigate(`/jobs/${jobId}`);
      }, 1500);
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Failed to update job");
      toast.info(`${err}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-blue-200 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white border-4 border-black">
          {/* ==================== LEFT PANEL ==================== */}
          <div className="lg:w-1/2 relative bg-linear-to-br from-blue-300 via-indigo-300 to-purple-300 p-6 sm:p-10 lg:p-12 flex flex-col gap-8 overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-black">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-300 rounded-full opacity-60" />
            <div className="absolute bottom-10 right-10 w-52 h-52 bg-pink-400 rounded-full opacity-60" />

            <Link
              to={`/jobs/${jobId}`}
              className="z-10 flex items-center gap-2 text-sm font-bold text-black bg-white px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all w-fit"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Job Details
            </Link>

            <div className="flex items-center gap-3 z-10">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border-2 border-white">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black text-black">
                Talent<span className=" text-white px-2 py-0.5 rounded-lg">Hub</span>
              </span>
            </div>

            <div className="z-10 space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black text-black leading-tight">
                Edit job listing
              </h1>
              <p className="text-black font-medium text-sm sm:text-base max-w-md bg-white/80 p-4 rounded-xl border-2 border-black">
                Update the details below to modify your job listing and ensure
                it attracts the right candidates.
              </p>
            </div>

            <div className="z-10 space-y-4 mt-4">
              {[
                { icon: Globe, text: "Update global or remote reach", color: "bg-blue-300" },
                { icon: CheckCircle, text: "Instant applicant tracking", color: "bg-green-400" },
                { icon: Tag, text: "AI-powered candidate matching", color: "bg-purple-400" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center border-2 border-black`}>
                    <item.icon className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-sm font-bold text-black">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ==================== RIGHT PANEL — FORM ==================== */}
          <div className="lg:w-1/2 flex items-start justify-center p-5 sm:p-8 lg:p-12 bg-yellow-50 overflow-y-auto max-h-screen">
            <div className="w-full max-w-lg">
              {error && (
                <div className="mb-6 p-4 bg-red-400 border-4 border-black rounded-2xl flex items-start gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <AlertCircle className="w-6 h-6 text-black shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-black">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ===== JOB BASICS ===== */}
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  <h3 className="text-sm font-black text-black uppercase tracking-wide border-b-4 border-black pb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" /> Job Basics
                  </h3>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
                      <input
                        type="text"
                        name="title"
                        defaultValue={currentJob.title || ""}
                        placeholder="e.g. Senior Frontend Developer"
                        className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Category
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
                        <input
                          type="text"
                          name="category"
                          defaultValue={currentJob.category || ""}
                          placeholder="e.g. Engineering"
                          className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Employment Type
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
                        <select
                          name="employmentType"
                          defaultValue={currentJob.employmentType || "Full-time"}
                          className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50 appearance-none cursor-pointer"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                          <option value="Freelance">Freelance</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== LOCATION & EXPERIENCE ===== */}
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  <h3 className="text-sm font-black text-black uppercase tracking-wide border-b-4 border-black pb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> Location & Experience
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Work Mode
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
                        <select
                          name="workMode"
                          defaultValue={currentJob.workMode || "On-site"}
                          className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50 appearance-none cursor-pointer"
                        >
                          <option value="On-site">On-site</option>
                          <option value="Remote">Remote</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
                        <input
                          type="text"
                          name="location"
                          defaultValue={currentJob.location || ""}
                          placeholder="e.g. San Francisco, CA"
                          className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Min Experience (Years)
                      </label>
                      <input
                        type="number"
                        name="experienceMin"
                        defaultValue={currentJob.experience?.min ?? ""}
                        placeholder="0"
                        min="0"
                        className="w-full px-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Max Experience (Years)
                      </label>
                      <input
                        type="number"
                        name="experienceMax"
                        defaultValue={currentJob.experience?.max ?? ""}
                        placeholder="e.g. 5"
                        min="0"
                        className="w-full px-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* ===== COMPENSATION ===== */}
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  <h3 className="text-sm font-black text-black uppercase tracking-wide border-b-4 border-black pb-2 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" /> Compensation
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Currency
                      </label>
                      <select
                        name="currency"
                        defaultValue={currentJob.salary?.currency || "USD"}
                        className="w-full px-3 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                      >
                        <option value="USD">USD</option>
                        <option value="INR">INR</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Period
                      </label>
                      <select
                        name="period"
                        defaultValue={currentJob.salary?.period || "year"}
                        className="w-full px-3 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                      >
                        <option value="year">/ year</option>
                        <option value="month">/ month</option>
                        <option value="hour">/ hour</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Min <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                        <input
                          type="number"
                          name="salaryMin"
                          defaultValue={currentJob.salary?.min ?? ""}
                          placeholder="50000"
                          min="0"
                          className="w-full pl-9 pr-3 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Max <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                        <input
                          type="number"
                          name="salaryMax"
                          defaultValue={currentJob.salary?.max ?? ""}
                          placeholder="80000"
                          min="0"
                          className="w-full pl-9 pr-3 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== DETAILS & SKILLS ===== */}
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  <h3 className="text-sm font-black text-black uppercase tracking-wide border-b-4 border-black pb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Details & Skills
                  </h3>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 w-5 h-5 text-black pointer-events-none" />
                      <textarea
                        name="description"
                        defaultValue={currentJob.description || ""}
                        rows={5}
                        placeholder="Describe the role, responsibilities, and requirements..."
                        className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50 resize-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Required Skills
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-4 w-5 h-5 text-black pointer-events-none" />
                      <textarea
                        name="skills"
                        defaultValue={currentJob.skills || ""}
                        rows={3}
                        placeholder="e.g. React, Node.js, MongoDB"
                        className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                      />
                    </div>
                    <p className="text-xs font-bold text-gray-600 mt-2 bg-yellow-200 inline-block px-2 py-1 rounded border-2 border-black">
                      Enter skills separated by commas.
                    </p>
                  </div>
                </div>

                {/* ===== JOB SETTINGS ===== */}
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  <h3 className="text-sm font-black text-black uppercase tracking-wide border-b-4 border-black pb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> Job Settings
                  </h3>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Expiry Date{" "}
                      <span className="text-gray-600 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
                      <input
                        type="date"
                        name="expiryDate"
                        defaultValue={
                          currentJob.expiryDate
                            ? new Date(currentJob.expiryDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                      />
                    </div>
                    <p className="text-xs font-bold text-gray-600 mt-2 bg-cyan-200 inline-block px-2 py-1 rounded border-2 border-black">
                      Leave blank to keep the job active indefinitely.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-black font-black rounded-2xl text-base border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 transition-all bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-3 mt-6"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-4 border-black/30 border-t-black rounded-full animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
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