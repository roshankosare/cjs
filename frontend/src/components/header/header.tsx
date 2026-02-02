import { useAuth } from "@/auth/useAuth";
import Logo from "../logo";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate("/");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <div className="bg-card/80 backdrop-blur-md sticky top-0 z-50 border-b border-border w-full h-[30] px-2 sm:px-5 py-2 sm:py-5 flex flex-row justify-between items-center">
      <div className="flex flex-row gap-x-8 items-center">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo size="lg" />
        </Link>

        <div className="hidden sm:flex sm:flex-row items-center gap-6">
          {Links.filter((link) => {
            if (user?.role === "ADMIN") {
              return link.title !== "Problems" && link.title !== "MCQ";
            }
            return true;
          }).map((link) => (
            <Link
              key={link.id}
              to={link.link}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
      )}

      {!isLoading && !isAuthenticated && (
        <div className="flex self-end">
          <Button asChild variant="default" className="rounded-md font-semibold px-6 shadow-md hover:shadow-lg transition-all">
            <Link to="/signin">Sign In</Link>
          </Button>
        </div>
      )}

      {!isLoading && isAuthenticated && (
        <div className="flex items-center gap-3">
          {/* USER PROFILE */}
          {user?.role === "USER" && (
            <Button
              asChild
              variant="secondary"
              size="icon"
              className="rounded-full shadow-sm hover:ring-2 hover:ring-primary/20 transition-all"
              title="Profile"
            >
              <Link to="/profile">
                <FiUser className="w-5 h-5" />
              </Link>
            </Button>
          )}

          {/* ADMIN DASHBOARD */}
          {user?.role === "ADMIN" && (
            <Button asChild variant="ghost" className="gap-2 font-medium">
              <Link to="/admin/dashboard">
                <MdDashboard className="w-5 h-5 text-primary" />
                Dashboard
              </Link>
            </Button>
          )}

          {/* LOGOUT */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors font-medium"
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
