// src/App.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLandingJobs } from "./redux/slices/jobSlice";
import { ToastContainer } from "react-toastify";
import {
  Briefcase,
  Building2,
  User,
  Search,
  Filter,
  Bookmark,
  FileText,
  Bot,
  Sparkles,
  TrendingUp,
  Users,
  Target,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle2,
  Star,
  MessageSquare,
  Brain,
  BarChart3,
  Clock,
  ChevronRight,
  MapPin,
} from "lucide-react";
import Navbar from "./components/Navbar";
import JobCard from "./components/JobCard";

export default function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const landingJobs = useSelector((state) => state.jobs.landingJobs);
  const isLoadingJobs = useSelector((state) => state.jobs.isLandingLoading);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const featuredJobs = landingJobs.slice(0, 3);
  const recentJobs = landingJobs.slice(3, 6);

  useEffect(() => {
    dispatch(fetchLandingJobs());
  }, [dispatch]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (locationQuery.trim()) params.set("location", locationQuery.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-yellow-300">
      <Navbar />

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden">
        {/* Left side - Yellow */}
        <div className="absolute inset-0 bg-yellow-300 lg:w-1/2" />
        {/* Right side - Purple */}
        <div className="absolute inset-0 bg-purple-200 lg:left-1/2 lg:w-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Left content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white border-2 border-black rounded-full px-4 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto lg:mx-0">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-bold text-black uppercase tracking-wide">
                  AI-Powered Hiring Platform
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-black leading-tight">
                  Where talent meets{" "}
                <span className="inline-block bg-cyan-400 px-4 py-1 transform -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  opportunity
                </span>
              </h1>

              {/* Search Bar */}
              <form
                onSubmit={handleSearch}
                className="bg-white p-3 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black flex flex-col gap-0 w-full max-w-lg mx-auto lg:mx-0"
              >
                <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b-2 border-black">
                  <Search className="w-5 h-5 text-black shrink-0" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 outline-none text-black placeholder-gray-500 bg-transparent text-sm sm:text-base font-medium"
                  />
                </div>
                <div className="flex-1 flex items-center gap-3 px-4 py-3">
                  <MapPin className="w-5 h-5 text-black shrink-0" />
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full py-2 outline-none text-black placeholder-gray-500 bg-transparent text-sm sm:text-base font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-purple-500 text-white p-4 rounded-xl font-bold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-2 mt-2 border-2 border-black"
                >
                  Search
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                  <span className="text-sm font-bold text-black">Free to start</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <CheckCircle2 className="w-5 h-5 text-orange-400" />
                  <span className="text-sm font-bold text-black">No credit card</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                  <span className="text-sm font-bold text-black">AI included</span>
                </div>
              </div>
            </div>

            {/* Right illustration — Fashion photos */}
            <div className="relative hidden lg:block">
              {/* Photo 1 - Top Left - Red background */}
              <div className="absolute top-0 left-0 w-64 h-80 bg-red-500 rounded-3xl transform -rotate-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden">
                <div className="w-full h-full bg-linear-to-br from-red-400 to-red-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Briefcase className="w-20 h-20 mx-auto mb-2" />
                    <p className="font-bold text-xl">248 Jobs</p>
                  </div>
                </div>
              </div>

              {/* Photo 2 - Top Right - Yellow background */}
              <div className="absolute top-8 right-8 w-64 h-80 bg-yellow-300 rounded-3xl transform rotate-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden">
                <div className="w-full h-full bg-linear-to-br from-yellow-200 to-yellow-400 flex items-center justify-center">
                  <div className="text-center text-black">
                    <Users className="w-20 h-20 mx-auto mb-2" />
                    <p className="font-bold text-xl">1.2k Applicants</p>
                  </div>
                </div>
              </div>

              {/* Photo 3 - Bottom - Green background */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-96 bg-green-400 rounded-3xl rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden">
                <div className="w-full h-full bg-linear-to-br from-green-300 to-green-500 flex items-center justify-center">
                  <div className="text-center text-black">
                    <TrendingUp className="w-20 h-20 mx-auto mb-2" />
                    <p className="font-bold text-xl">87% Match</p>
                  </div>
                </div>
              </div>

              {/* Decorative butterflies */}
              <div className="absolute top-20 left-10 text-pink-300">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div className="absolute bottom-32 right-10 text-pink-500">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>

              {/* AI Assistant badge */}
              <div className="absolute -top-6 -right-8 bg-white rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 border-4 border-black flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center border-2 border-black">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">AI Assistant</p>
                  <p className="text-xs text-gray-600">Ready to help</p>
                </div>
              </div>

              {/* Bookmark badge */}
              <div className="absolute -bottom-4 -left-8 bg-white rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 border-4 border-black flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-300 rounded-xl flex items-center justify-center border-2 border-black">
                  <Bookmark className="w-6 h-6 text-black" fill="currentColor" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">12 saved</p>
                  <p className="text-xs text-gray-600">Jobs bookmarked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED & RECENT JOBS ==================== */}
      <section className="py-16 sm:py-20 bg-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Featured Jobs */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl font-black text-black mb-2">
                  Featured Jobs
                </h2>
                <p className="text-gray-700 font-medium">
                  Hand-picked opportunities from top companies.
                </p>
              </div>
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-1 text-sm font-bold text-black hover:text-cyan-600 bg-white px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                View all jobs <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {isLoadingJobs ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-5 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse h-28"
                  ></div>
                ))}
              </div>
            ) : featuredJobs.length > 0 ? (
              <div className="space-y-4">
                {featuredJobs.map((job) => (
                  <JobCard key={job._id} job={job} isFeatured={true} />
                ))}
              </div>
            ) : (
              <p className="text-black text-center py-8 bg-white rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-medium">
                No featured jobs available at the moment.
              </p>
            )}
          </div>

          {/* Recently Posted Jobs */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl font-black text-black mb-2">
                  Recently Posted
                </h2>
                <p className="text-gray-700 font-medium">
                  Be the first to apply to the newest opportunities.
                </p>
              </div>
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-1 text-sm font-bold text-black hover:text-cyan-600 bg-white px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                View all jobs <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {isLoadingJobs ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-5 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse h-28"
                  ></div>
                ))}
              </div>
            ) : recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <p className="text-black text-center py-8 bg-white rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-medium">
                No recent jobs available at the moment.
              </p>
            )}

            <div className="mt-8 text-center">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-4 border-black text-black font-bold rounded-2xl hover:bg-gray-50 transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto"
              >
                View All Jobs <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES — DUAL ROLE ==================== */}
      <section id="features" className="py-16 sm:py-20 bg-yellow-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="inline-block text-xs font-bold text-black bg-cyan-400 px-4 py-2 rounded-full mb-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              BUILT FOR EVERYONE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-4">
              One platform, two powerful experiences
            </h2>
            <p className="text-gray-700 text-base sm:text-lg font-medium">
              Whether you're hiring or being hired, TalentHub gives you the
              tools to succeed.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* For Applicants */}
            <div className="relative bg-white rounded-3xl p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-400 rounded-full" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shrink-0 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-cyan-600 uppercase tracking-wide mb-1">
                      For Applicants
                    </p>
                    <h3 className="text-2xl font-black text-black">
                      Land your dream job
                    </h3>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      icon: Search,
                      title: "Smart job search",
                      desc: "Find roles that match your skills and goals.",
                    },
                    {
                      icon: Filter,
                      title: "Advanced filters",
                      desc: "Filter by location, salary, experience and more.",
                    },
                    {
                      icon: Bookmark,
                      title: "Bookmark jobs",
                      desc: "Save opportunities and apply when you're ready.",
                    },
                    {
                      icon: FileText,
                      title: "Application tracking",
                      desc: "Track every application in real-time.",
                    },
                    {
                      icon: Bot,
                      title: "AI interview prep",
                      desc: "Practice with AI-powered mock interviews.",
                    },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border-2 border-black"
                    >
                      <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center shrink-0 border-2 border-black">
                        <f.icon className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="font-bold text-black text-sm">
                          {f.title}
                        </p>
                        <p className="text-xs text-gray-600 font-medium">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* For Recruiters */}
            <div className="relative bg-white rounded-3xl p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-300 rounded-full" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center shrink-0 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-1">
                      For Recruiters
                    </p>
                    <h3 className="text-2xl font-black text-black">
                      Hire smarter, faster
                    </h3>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      icon: Briefcase,
                      title: "Post & manage jobs",
                      desc: "Create listings and manage applicants in one place.",
                    },
                    {
                      icon: BarChart3,
                      title: "Recruiter analytics",
                      desc: "Track performance with detailed dashboards.",
                    },
                    {
                      icon: Target,
                      title: "AI candidate matching",
                      desc: "Let AI surface the best-fit applicants instantly.",
                    },
                    {
                      icon: MessageSquare,
                      title: "Unified inbox",
                      desc: "Communicate with candidates seamlessly.",
                    },
                    {
                      icon: Shield,
                      title: "Role-based access",
                      desc: "Secure, team-ready permissions and workflows.",
                    },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border-2 border-black"
                    >
                      <div className="w-10 h-10 bg-orange-300 rounded-lg flex items-center justify-center shrink-0 border-2 border-black">
                        <f.icon className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="font-bold text-black text-sm">
                          {f.title}
                        </p>
                        <p className="text-xs text-gray-600 font-medium">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="inline-block text-xs font-bold text-black bg-orange-300 px-4 py-2 rounded-full mb-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-4">
              Get started in minutes
            </h2>
            <p className="text-gray-700 text-base sm:text-lg font-medium">
              A simple flow designed to get you from signup to success as fast
              as possible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Create account",
                desc: "Sign up as applicant or recruiter in seconds.",
                icon: User,
                color: "bg-purple-500",
              },
              {
                step: "02",
                title: "Set up profile",
                desc: "Add skills, experience or post your first job.",
                icon: FileText,
                color: "bg-cyan-400",
              },
              {
                step: "03",
                title: "Let AI assist",
                desc: "Get smart matches, suggestions and prep help.",
                icon: Bot,
                color: "bg-orange-300",
              },
              {
                step: "04",
                title: "Succeed",
                desc: "Land the job or hire the perfect candidate.",
                icon: Star,
                color: "bg-green-400",
              },
            ].map((s, i) => (
              <div key={i} className="relative group">
                <div className="bg-yellow-200 border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all h-full">
                  <div
                    className={`inline-flex w-12 h-12 rounded-xl ${s.color} items-center justify-center mb-4 border-2 border-black`}
                  >
                    <s.icon className="w-6 h-6 text-black" />
                  </div>
                  <p className="text-xs font-bold text-black mb-2 bg-white inline-block px-2 py-1 rounded border-2 border-black">
                    STEP {s.step}
                  </p>
                  <h4 className="text-lg font-black text-black mb-2">
                    {s.title}
                  </h4>
                  <p className="text-sm text-gray-700 font-medium">{s.desc}</p>
                </div>
                {i < 3 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 text-black -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== AI SECTION ==================== */}
      <section
        id="ai"
        className="relative py-16 sm:py-20 bg-cyan-200 overflow-hidden"
      >
        <div className="absolute -top-20 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-300 rounded-full" />
        <div className="absolute -bottom-20 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-orange-300 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-black rounded-full px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-bold text-black">
                AI-POWERED
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-4">
              Intelligence at every step
            </h2>
            <p className="text-gray-700 text-base sm:text-lg font-medium">
              Our AI doesn't just assist — it transforms how you hire and get
              hired.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "Smart resume parsing",
                desc: "AI extracts skills, experience and qualifications automatically.",
                color: "bg-purple-500",
              },
              {
                icon: Target,
                title: "Candidate-job matching",
                desc: "Get ranked matches based on skills, culture fit and career trajectory.",
                color: "bg-cyan-400",
              },
              {
                icon: MessageSquare,
                title: "AI interview coach",
                desc: "Practice with realistic questions and get instant feedback on your answers.",
                color: "bg-orange-300",
              },
              {
                icon: Zap,
                title: "Auto job descriptions",
                desc: "Generate compelling, inclusive job posts in seconds with AI.",
                color: "bg-green-400",
              },
              {
                icon: BarChart3,
                title: "Predictive analytics",
                desc: "Forecast hiring timelines, salary benchmarks and applicant quality.",
                color: "bg-purple-500",
              },
              {
                icon: Shield,
                title: "Bias detection",
                desc: "AI flags biased language in job posts to help you build diverse teams.",
                color: "bg-cyan-400",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 h-full"
              >
                <div
                  className={`inline-flex w-12 h-12 rounded-xl ${f.color} items-center justify-center mb-4 border-2 border-black group-hover:scale-110 transition-transform`}
                >
                  <f.icon className="w-6 h-6 text-black" />
                </div>
                <h4 className="text-lg font-black text-black mb-2">
                  {f.title}
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section id="testimonials" className="py-16 sm:py-20 bg-yellow-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="inline-block text-xs font-bold text-black bg-purple-500 px-4 py-2 rounded-full mb-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-4">
              Loved by recruiters and applicants
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "TalentHub's AI matching cut our time-to-hire by 60%. The best hiring platform we've used.",
                name: "Sarah Chen",
                role: "Head of Talent, TechCorp",
                color: "bg-cyan-400",
              },
              {
                quote:
                  "The interview prep AI is a game-changer. I landed my dream job after 3 mock sessions.",
                name: "Marcus Johnson",
                role: "Software Engineer",
                color: "bg-orange-300",
              },
              {
                quote:
                  "Clean UI, powerful analytics, and the AI suggestions are scarily accurate. Highly recommend.",
                name: "Priya Patel",
                role: "Recruiting Manager, DesignLab",
                color: "bg-purple-500",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all h-full flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      stroke="black"
                      strokeWidth="1.5"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed flex-1 font-medium">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center shrink-0 border-2 border-black`}
                  >
                    <User className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="font-bold text-black text-sm">{t.name}</p>
                    <p className="text-xs text-gray-600 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-16 sm:py-20 bg-purple-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-black rounded-full px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
            <Zap className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-bold text-black">
              READY TO START?
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mb-4 leading-tight">
            Your next career move <br className="hidden sm:block" />
            starts right here.
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto font-medium">
            Join thousands of recruiters and applicants already using TalentHub
            to build the future of work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-purple-500 text-white font-bold px-8 py-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all border-2 border-black text-lg"
            >
              Join Here
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all border-2 border-black text-lg"
            >
              Learn More
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-black text-white border-t-4 border-cyan-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-cyan-400 rounded-xl flex items-center justify-center border-2 border-white">
                  <Briefcase className="w-6 h-6 text-black" />
                </div>
                <span className="text-2xl font-black text-white">
                  Talent<span className="text-cyan-400">Hub</span>
                </span>
              </div>
              <p className="text-sm text-gray-400 max-w-xs font-medium">
                Empowering the future of work with intelligent hiring solutions.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm font-bold">
              <Link to="/jobs" className="hover:text-cyan-400 transition-colors bg-primary text-black px-4 py-2 rounded-lg border-2 border-white">
                Find Jobs
              </Link>
              <a
                href="#features"
                className="hover:text-cyan-400 transition-colors  bg-primary text-black px-4 py-2 rounded-lg border-2 border-white"
              >
                Features
              </a>
              <a href="#ai" className="hover:text-cyan-400 transition-colors bg-primary text-black px-4 py-2 rounded-lg border-2 border-white">
                AI Tools
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-medium">
              © 2026 TalentHub. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-cyan-400 transition-colors cursor-pointer border-2 border-gray-700">
                <Globe className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-cyan-400 transition-colors cursor-pointer border-2 border-gray-700">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </footer>
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
    </div>
  );
}