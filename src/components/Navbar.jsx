// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Menu, X, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser, logoutUser } from "../redux/slices/authSlice";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const dashboardLink =
    user?.role === "applicant"
      ? "/applicant/dashboard"
      : "/recruiter/dashboard";
      
  const firstName = user?.fullName;
  const firstLetter = user?.fullName
    ? user.fullName.trim().charAt(0).toUpperCase()
    : "U";

  return (
    <nav className="sticky top-0 z-50 bg-cyan-400 border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border-2 border-white">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-black">
              Talent<span className="text-white px-2 py-0.5 rounded">Hub</span>
            </span>
          </Link>

          {/* DESKTOP CTA / USER PROFILE */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse border-2 border-black"></div>
            ) : user ? (
              <>
                <Link
                  to="/jobs"
                  className="text-sm font-bold text-black hover:text-white transition-colors"
                >
                  Jobs
                </Link>
                <Link
                  to={dashboardLink}
                  className="text-sm font-bold text-black bg-white px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  Dashboard
                </Link>

                <div className="flex items-center gap-3 pl-4 border-l-2 border-black">
                  <Link
                    to="/profile"
                    className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm overflow-hidden border-2 border-white shrink-0"
                  >
                    {user.role === "applicant" && user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      firstLetter
                    )}
                  </Link>
                  <span className="text-sm font-bold text-black">
                    {firstName}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-black hover:bg-red-400 hover:text-white rounded-xl transition-colors border-2 border-black"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-bold text-black bg-white px-5 py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-bold text-white bg-black px-5 py-2.5 rounded-xl border-2 border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden p-2 text-black bg-white rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t-2 border-black mt-2 pt-4">
            <div className="pt-3 border-t-2 border-black mt-2">
              {isLoading ? (
                <div className="h-10 bg-gray-200 rounded-xl animate-pulse border-2 border-black"></div>
              ) : user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3">
                    <Link
                      to="/profile"
                      className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold text-base overflow-hidden border-2 border-white shrink-0"
                    >
                      {user.role === "applicant" && user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        firstLetter
                      )}
                    </Link>
                    <div>
                      <p className="text-sm font-bold text-black">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-600 capitalize font-medium">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/jobs"
                    className="block w-full text-center text-sm font-bold text-black bg-yellow-300 px-5 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Jobs
                  </Link>
                  <Link
                    to={dashboardLink}
                    className="block w-full text-center text-sm font-bold text-white bg-purple-500 px-5 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    Go to Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="block w-full text-center text-sm font-bold text-white bg-red-400 px-4 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="text-center text-sm font-bold text-black bg-white border-2 border-black px-4 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="text-center text-sm font-bold text-white bg-black px-5 py-3 rounded-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}