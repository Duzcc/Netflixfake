import React, { useState, useEffect } from "react";
import { BsFillGridFill } from "react-icons/bs";
import { FaListAlt, FaUsers, FaHeart } from "react-icons/fa";
import { RiMovie2Fill, RiLockPasswordLine } from "react-icons/ri";
import { HiViewGridAdd } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import Layout from "../../Layout/Layout";
import { NavLink } from "react-router-dom";
import { getCurrentUser } from "../../utils/authUtils";

function SideBar({ children }) {
  const [user, setUser] = useState(null);

  // Load user on mount and listen for auth changes
  useEffect(() => {
    const loadUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    };

    // Initial load
    loadUser();

    // Listen for user login/logout/update events
    window.addEventListener("userLoggedIn", loadUser);
    window.addEventListener("userLoggedOut", loadUser);
    window.addEventListener("userProfileUpdated", loadUser);

    return () => {
      window.removeEventListener("userLoggedIn", loadUser);
      window.removeEventListener("userLoggedOut", loadUser);
      window.removeEventListener("userProfileUpdated", loadUser);
    };
  }, []);

  const SideLinks = [
    {
      name: "Admin Dashboard",
      link: "/dashboard",
      icon: BsFillGridFill,
      isAdmin: true,
    },
    {
      name: "Movies List",
      link: "/movieslist",
      icon: FaListAlt,
      isAdmin: true,
    },
    {
      name: "Add Movie",
      link: "/addmovie",
      icon: RiMovie2Fill,
      isAdmin: true,
    },
    {
      name: "Categories",
      link: "/categories",
      icon: HiViewGridAdd,
      isAdmin: true,
    },
    {
      name: "Users",
      link: "/users",
      icon: FaUsers,
      isAdmin: true,
    },
    {
      name: "TMDb Import",
      link: "/tmdb-import",
      icon: HiViewGridAdd,
      isAdmin: true,
    },
    {
      name: "Dashboard",
      link: "/user-dashboard",
      icon: BsFillGridFill,
      isAdmin: false,
    },
    {
      name: "Watchlist",
      link: "/watchlist",
      icon: FaListAlt,
      isAdmin: false,
    },
    {
      name: "Watch History",
      link: "/history",
      icon: RiMovie2Fill,
      isAdmin: false,
    },
    {
      name: "Update Profile",
      link: "/profile",
      icon: FiSettings,
      isAdmin: false,
    },
    {
      name: "Favorites Movies",
      link: "/favorites",
      icon: FaHeart,
      isAdmin: false,
    },
    {
      name: "Change Password",
      link: "/password",
      icon: RiLockPasswordLine,
      isAdmin: false,
    },
  ];

  // Filter links based on user role
  const activeLinks = user?.role === "admin"
    ? SideLinks.filter(link => link.isAdmin || ["Update Profile", "Change Password"].includes(link.name))
    : SideLinks.filter(link => !link.isAdmin);

  const active = "bg-dryGray text-subMain";
  const hover = "hover:text-white hover:bg-main";
  const inActive =
    "rounded font-medium text-sm transitions flex gap-3 items-center p-4";
  const Hover = ({ isActive }) =>
    isActive ? `${active} ${inActive}` : `${inActive} ${hover}`;

  return (
    <Layout>
      <div className="min-h-screen container mx-auto px-2">
        <div className="xl:grid grid-cols-8 gap-10 items-start md:py-12 py-6">
          <div className="col-span-2 sticky bg-dry border border-gray-800 p-6 rounded-md xl:mb-0 mb-5">
            {
              // SideBar Links
              activeLinks.map((link, index) => (
                <NavLink to={link.link} key={index} className={Hover}>
                  <link.icon /> <p>{link.name}</p>
                </NavLink>
              ))
            }
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="10"
            data-aos-offset="200"
            className="col-span-6 rounded-md bg-dry border border-gray-800 p-6"
          >
            {children}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SideBar;
