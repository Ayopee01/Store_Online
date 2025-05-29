import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sticky top-0 scroll-mt-90 relative z-50">
      <div
        className="absolute inset-x-0 top-full h-8 pointer-events-none z-[-1]"
        style={{
          filter: "blur(12px)",
        }}
      >
        <div className="w-full h-full bg-gradient-to-b from-blue-400/60 via-purple-400/50 to-transparent" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 shadow-2xl flex justify-center items-center px-10 md:px-20 py-4 md:py-6 z-50 backdrop-blur-[2px] md:justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 hidden md:flex">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="white" />
            <path d="M8 14l2-2 4 4M12 10V6" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-2xl font-extrabold text-white select-none drop-shadow-lg tracking-wide">
            Store Online
          </span>
        </div>

        {/* User info & Logout */}
        <div className="flex items-center gap-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 border flex items-center justify-center text-gray-500 text-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M2 20c0-4 8-6 10-6s10 2 10 6" />
              </svg>
            </div>
          )}
          <span className="font-semibold text-white text-lg drop-shadow">{user?.username || "Guest"}</span>
          <button
            onClick={handleLogout}
            className="cursor-pointer ml-2 px-4 py-2 bg-white/20 hover:bg-white/40 text-white font-bold rounded-xl shadow transition-all duration-200 border border-white/30"
            title="Log Out"
          >
            <svg className="w-5 h-5 inline-block mr-1 -mt-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h4a2 2 0 002-2v-1m-6-4V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2z" />
            </svg>
            Log Out
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
