import { useAuth } from "@/auth/useAuth";
import Logo from "../logo";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { Button } from "../ui/button";
import ConfirmLogoutModal from "../confirm-log-out-model";
import { useState } from "react";

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
  {
    id: 3,
    title: "DSA Practice",
    link: "/dsa-practice",
  },
];

const Header = () => {
  const { isLoading, isAuthenticated, logout } = useAuth();
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
            <a
              key={link.id}
              href={link.link}
              className="mx-4 text-md font-medium text-gray-500 hover:text-blue-500 flex pb-0"
            >
              {link.title}
            </a>
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
        <div className="flex flex-row gap-x-2 ">
          <Link to="/profile">
            <FiUser className="bg-blue-600 text-white px-2 py-2 w-8 h-8 font-bold rounded-full" />
          </Link>
          {/* <p className="text-xs">{user?.username}</p> */}

          <Button
            className="text-xs  rounded-4xl flex px-3 py-0 "
            variant={"outline"}
            onClick={() => setOpen(true)}
          >
            Log Out
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
