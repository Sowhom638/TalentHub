import { Building2, DollarSign, Globe, MapPin, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function JobCard({ job, isFeatured = false }) {
  const formatDate = (dateString) => {
    const diff = new Date() - new Date(dateString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const formatSalary = (min, max, currency = "USD", period = "year") => {
    return `${currency} ${Number(min).toLocaleString()} - ${Number(max).toLocaleString()} / ${period}`;
  };

  return (
    <div className="group bg-white border-4 border-gray-900 p-5 shadow-[6px_6px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Company Logo */}
        <div className="w-14 h-14 bg-primary border-2 border-gray-900 flex items-center justify-center shrink-0 overflow-hidden">
          {job.recruiter?.companyLogo ? (
            <img src={job.recruiter.companyLogo} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-7 h-7 text-gray-900" />
          )}
        </div>

        {/* Job Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-lg font-black text-gray-900 group-hover:text-primaryBtn transition-colors truncate">
              {job.title}
            </h3>
            {isFeatured && (
              <span className="shrink-0 px-2 py-0.5 bg-primary text-gray-900 text-[10px] font-black uppercase tracking-wider border-2 border-gray-900">
                Featured
              </span>
            )}
          </div>

          <p className="text-sm text-gray-700 font-bold mb-2 truncate">
            {job.recruiter?.companyName || job.recruiter?.fullName || "Company"}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-900 font-semibold mb-3">
            <span className="flex items-center gap-1 bg-lavender/50 border-2 border-gray-900 px-2 py-1">
              <MapPin className="w-3 h-3" /> {job.location}
            </span>
            <span className="flex items-center gap-1 bg-secondary/50 border-2 border-gray-900 px-2 py-1">
              <Globe className="w-3 h-3" /> {job.workMode}
            </span>
            <span className="flex items-center gap-1 bg-primary/50 border-2 border-gray-900 px-2 py-1">
              <DollarSign className="w-3 h-3" /> {formatSalary(job.salary.min, job.salary.max, job.salary.currency, job.salary.period)}
            </span>
          </div>

          {/* Extra Context */}
          <div className="flex items-center gap-3 text-xs text-gray-700 font-semibold">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {job.employmentType}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {formatDate(job.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Link
        to={`/jobs/${job._id}`}
        className="btn-shadow shrink-0 px-5 py-3 bg-primaryBtn text-white text-sm font-black border-2 border-gray-900 hover:bg-primaryBtn/90 transition-all text-center whitespace-nowrap"
      >
        View Details
      </Link>
    </div>
  );
}