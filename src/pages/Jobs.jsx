// src/pages/Jobs.jsx
import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Search,
  Filter,
  ArrowUpDown,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobs } from "../redux/slices/jobSlice";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  
  const { jobs, pagination, isLoading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";
  const workMode = searchParams.get("workMode") || "";
  const employmentType = searchParams.get("employmentType") || "";
  const salaryMin = searchParams.get("salaryMin") || "";
  const salaryMax = searchParams.get("salaryMax") || "";
  const experienceMin = searchParams.get("experienceMin") || "";
  const experienceMax = searchParams.get("experienceMax") || "";
  const sort = searchParams.get("sort") || "-createdAt";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (user?.role === "recruiter") {
      params.set("recruiterOnly", "true");
    }
    dispatch(fetchJobs(params.toString()));
  }, [searchParams, user, dispatch]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== "page") newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters =
    location || workMode || employmentType || salaryMin || salaryMax || experienceMin || experienceMax || search;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cyan-200">
        {/* ==================== HEADER ==================== */}
        <div className="bg-yellow-300 border-b-4 border-black sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link
                  to="/recruiter/dashboard"
                  className="p-3 rounded-xl border-2 border-black bg-white hover:bg-gray-50 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
                >
                  <ArrowLeft className="w-5 h-5 text-black" />
                </Link>
                <div>
                  <h1 className="text-3xl font-black text-black">Find Your Next Role</h1>
                  <p className="text-sm text-black font-bold mt-1">
                    {isLoading ? "Loading..." : `${pagination.totalJobs} jobs found`}
                  </p>
                </div>
              </div>

              <div className="flex flex-1 md:max-w-2xl gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                  <input
                    type="text"
                    placeholder="Search by title, skills, ..."
                    value={search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                  />
                </div>

                <div className="relative min-w-40">
                  <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                  <select
                    value={sort}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    className="w-full pl-12 pr-8 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50 appearance-none cursor-pointer"
                  >
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="salary-desc">Salary: High to Low</option>
                    <option value="salary-asc">Salary: Low to High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== MAIN CONTENT ==================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* ==================== SIDEBAR FILTERS ==================== */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-black uppercase tracking-wide flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center border-2 border-black">
                    <Filter className="w-3.5 h-3.5 text-black" />
                  </div>
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-black text-black bg-red-400 px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear all
                  </button>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
                {/* Work Mode */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Work Mode</label>
                  <select
                    value={workMode}
                    onChange={(e) => updateFilter("workMode", e.target.value)}
                    className="w-full px-3 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50 appearance-none cursor-pointer"
                  >
                    <option value="">Any</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => updateFilter("employmentType", e.target.value)}
                    className="w-full px-3 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50 appearance-none cursor-pointer"
                  >
                    <option value="">Any</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                    <input
                      type="text"
                      placeholder="e.g. New York, Remote"
                      value={location}
                      onChange={(e) => updateFilter("location", e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                    />
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Salary Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                      <input
                        type="number"
                        placeholder="Min"
                        value={salaryMin}
                        onChange={(e) => updateFilter("salaryMin", e.target.value)}
                        className="w-full pl-9 pr-3 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                      />
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                      <input
                        type="number"
                        placeholder="Max"
                        value={salaryMax}
                        onChange={(e) => updateFilter("salaryMax", e.target.value)}
                        className="w-full pl-9 pr-3 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Experience Range */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Experience (Years)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={experienceMin}
                      onChange={(e) => updateFilter("experienceMin", e.target.value)}
                      className="w-full px-3 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={experienceMax}
                      onChange={(e) => updateFilter("experienceMax", e.target.value)}
                      className="w-full px-3 py-3 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== JOB LIST ==================== */}
            <div className="lg:col-span-3 space-y-4">
              {isLoading ? (
                // Loading Skeleton
                [...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                    <div className="h-6 bg-gray-200 rounded-xl border-2 border-black w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded-xl border-2 border-black w-1/4 mb-6"></div>
                    <div className="flex gap-4 mb-4">
                      <div className="h-8 bg-gray-200 rounded-xl border-2 border-black w-24"></div>
                      <div className="h-8 bg-gray-200 rounded-xl border-2 border-black w-24"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-xl border-2 border-black w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-xl border-2 border-black w-2/3"></div>
                  </div>
                ))
              ) : jobs.length === 0 ? (
                // Empty State
                <div className="bg-white p-12 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
                  <div className="w-20 h-20 bg-purple-300 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
                    <Briefcase className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="text-xl font-black text-black mb-2">No jobs found</h3>
                  <p className="text-gray-700 mb-6 font-medium max-w-md mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-purple-500 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                // Job Cards
                jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))
              )}

              {/* ==================== PAGINATION ==================== */}
              {!isLoading && pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                  <button
                    onClick={() => updateFilter("page", String(Math.max(1, Number(page) - 1)))}
                    disabled={Number(page) === 1}
                    className="px-5 py-3 text-sm font-black text-black bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <span className="text-sm font-black text-black bg-yellow-300 px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    Page <span className="text-purple-600">{pagination.currentPage}</span> of{" "}
                    <span className="text-purple-600">{pagination.totalPages}</span>
                  </span>

                  <button
                    onClick={() => updateFilter("page", String(Math.min(pagination.totalPages, Number(page) + 1)))}
                    disabled={Number(page) >= pagination.totalPages}
                    className="px-5 py-3 text-sm font-black text-black bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex items-center gap-2"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}