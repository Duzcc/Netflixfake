import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import MainDrawer from "./MainDrawer";
import { IoClose } from "react-icons/io5";
import { BsCollectionPlay, BsFillGridFill } from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BiPhoneCall } from "react-icons/bi";
import { FaFacebook, FaMedium, FaTelegram, FaYoutube } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { CgUser } from "react-icons/cg";
import { getCurrentUser, isAuthenticated, logout } from "../../utils/authUtils";

function MenuDrawer({ drawerOpen, toggleDrawer }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const active = "bg-dry text-subMain";
  const hover = "hover:bg-dry";
  const inActive =
    "rounded sm:gap-10 font-medium text-sm transitions flex gap-6 items-center sm:px-8 px-4 py-4 items-center";
  const Hover = ({ isActive }) =>
    isActive ? `${active} ${inActive}` : `${inActive} ${hover}`;

  const updateUserInfo = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  useEffect(() => {
    updateUserInfo();

    // Listen for user login/logout/profile updates
    window.addEventListener("userLoggedIn", updateUserInfo);
    window.addEventListener("userLoggedOut", updateUserInfo);
    window.addEventListener("userProfileUpdated", updateUserInfo);

    return () => {
      window.removeEventListener("userLoggedIn", updateUserInfo);
      window.removeEventListener("userLoggedOut", updateUserInfo);
      window.removeEventListener("userProfileUpdated", updateUserInfo);
    };
  }, []);

  const Links = [
    {
      name: "Movies",
      link: "/movies",
      icon: BsCollectionPlay,
    },
    {
      name: "About Us",
      link: "/about-us",
      icon: HiOutlineUserGroup,
    },
    {
      name: "Contact Us",
      link: "/contact-us",
      icon: BiPhoneCall,
    },
    // Show Dashboard link only for admin
    ...(user?.role === "admin"
      ? [
        {
          name: "Dashboard",
          link: "/dashboard",
          icon: BsFillGridFill,
        },
      ]
      : []),
  ];

  const LinkDatas = [
    {
      icon: FaFacebook,
      link: "https://www.facebook.com/share/1EqD5JCvZ9/?mibextid=wwXIfr",
    },
    {
      icon: FaMedium,
      link: "https://medium.com/@irenemmassyy",
    },
    {
      icon: FaTelegram,
      link: "",
    },
    {
      icon: FaYoutube,
      link: "",
    },
  ];

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      logout();
      toggleDrawer();
      navigate("/login");
    }
  };

  const getAvatarUrl = () => {
    if (user?.avatar) {
      return user.avatar;
    }
    return "/default-avatar.png";
  };

  return (
    <MainDrawer drawerOpen={drawerOpen} closeDrawer={toggleDrawer}>
      <div className="flex flex-col w-full h-full justify-between items-center bg-main text-white rounded">
        <div className="w-full flex-btn h-16 px-6 py-4 bg-dry">
          <Link onClick={toggleDrawer} to="/">
            <img
              src="/favicon.png"
              alt="logo"
              className="w-28 h-28 object-contain"
            />
          </Link>
          <button
            onClick={toggleDrawer}
            type="button"
            className="
              transitions w-10 h-10 flex-colo text-base text-subMain bg-white rounded-full hover:bg-subMain hover:text-white
              "
          >
            <IoClose />
          </button>
        </div>

        {/* User Info Section */}
        {isAuthenticated() && user && (
          <div className="w-full px-6 py-4 bg-dry border-b border-border">
            <div className="flex items-center gap-3">
              <img
                src={getAvatarUrl()}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-subMain"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-border truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* menu links */}
        <div className="w-full overflow-y-scroll flex-grow max-height-full">
          <div className="pb-12 pt-4">
            {Links.map((link, index) => (
              <NavLink
                to={link.link}
                key={index}
                onClick={toggleDrawer}
                className={Hover}
              >
                <link.icon className="text-lg" /> {link.name}
              </NavLink>
            ))}

            {/* Profile Link (only when authenticated) */}
            {isAuthenticated() && (
              <NavLink
                to="/profile"
                onClick={toggleDrawer}
                className={Hover}
              >
                <CgUser className="text-lg" /> Profile
              </NavLink>
            )}

            {/* Logout Button (only when authenticated) */}
            {isAuthenticated() ? (
              <button
                onClick={handleLogout}
                className={`${inActive} ${hover} w-full text-red-500`}
              >
                <FiLogOut className="text-lg" /> Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={toggleDrawer}
                className={Hover}
              >
                <CgUser className="text-lg" /> Login
              </NavLink>
            )}
          </div>

          <div className="flex-rows gap-6 w-full">
            {LinkDatas.map((link, index) => (
              <a
                href={link.link}
                key={index}
                target="_blank"
                rel="noreferrer"
                className="flex-colo w-12 h-12 transitions hover:bg-subMain text-lg bg-white rounded bg-opacity-30"
              >
                <link.icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </MainDrawer>
  );
}

export default MenuDrawer;

