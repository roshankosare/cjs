import { useAuth } from "@/auth/useAuth";
import Logo from "../logo";
import { Link } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";
import { Button } from "../ui/button";
import ConfirmLogoutModal from "../confirm-log-out-model";
import { useState } from "react";
import { MdDashboard } from "react-icons/md";

const Links = [
  {
    id: 1,
    title: "Home",
    link: "/",
  },
  {
    id: 2,
    title: "Problems",
    link: "/problems",
  },
  // {
  //   id: 3,
  //   title: "DSA Practice",
  //   link: "/dsa-practice",
  // },
  {
    id: 3,
    title: "MCQ",
    link: "/mcq",
  },
];

const Header = () => {
  const { isLoading, isAuthenticated, logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      logout();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <div className=" shadow-sm w-full h-[30]  px-2 sm:px-5 py-2 sm:py-5 flex flex-row justify-between items-center">
      <div className="flex flex-row gap-x-8">
        <Logo size="lg" />

        <div className="hidden sm:flex sm:flex-row self-end  ">
          {Links.map((link) => (
            <Link
              key={link.id}
              to={link.link}
              className="mx-4 text-md font-medium text-gray-500 hover:text-blue-500 flex pb-0"
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="w-8 h-8 rounded-full bg-gray-400 animate-pulse"></div>
      )}

      {!isLoading && !isAuthenticated && (
        <div className=" sm:flex sm:flex-row self-end  ">
          <Link
            to="/signin"
            className="mx-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-500 flex"
          >
            Sign In
          </Link>
        </div>
      )}

      {!isLoading && isAuthenticated && (
        <div className="flex items-center gap-4">
          {/* USER PROFILE */}
          {user?.role === "USER" && (
            <Link
              to="/profile"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white hover:ring-2 hover:ring-blue-400 transition"
              title="Profile"
            >
              <FiUser className="w-4 h-4" />
            </Link>
          )}

          {/* ADMIN DASHBOARD */}
          {user?.role === "ADMIN" && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
            >
              <MdDashboard className="w-5 h-5" />
              Dashboard
            </Link>
          )}

          {/* LOGOUT */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpen(true)}
            className="flex items-center gap-1"
          >
            <FiLogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      )}
      <ConfirmLogoutModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleLogout}
        loading={loading}
      />
    </div>
  );
};

export default Header;
