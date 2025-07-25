import React, { useEffect, useState } from "react";
import Uploder from "../../Components/Uploder";
import { Input } from "../../Components/UsedInputs";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("registeredUser"));
    if (storedUser) {
      setFullName(storedUser.fullName || "");
      setEmail(storedUser.email || "");
    }
  }, []);

  const handleUpdate = () => {
    const storedUser = JSON.parse(localStorage.getItem("registeredUser"));
    if (!storedUser) {
      setMessage("No user found.");
      return;
    }

    const updatedUser = {
      ...storedUser,
      fullName: fullName.trim(),
      email: email.trim(),
    };

    localStorage.setItem("registeredUser", JSON.stringify(updatedUser));
    setMessage("Profile updated successfully.");
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem("registeredUser");
    setMessage("Account deleted.");
    setTimeout(() => navigate("/login"), 1000);
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Profile</h2>

        {message && <p className="text-sm text-subMain font-medium">{message}</p>}

        <Uploder />

        <Input
          label="Full Name"
          placeholder="Netflixo React Tailwind"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          bg={true}
        />

        <Input
          label="Email"
          placeholder="netflixo@gmail.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          bg={true}
        />

        <div className="flex gap-2 flex-wrap flex-col-reverse sm:flex-row justify-between items-center my-4">
          <button
            onClick={handleDeleteAccount}
            className="bg-subMain font-medium transitions hover:bg-main border border-subMain text-white py-3 px-6 rounded w-full sm:w-auto"
          >
            Delete Account
          </button>

          <button
            onClick={handleUpdate}
            className="bg-main font-medium transitions hover:bg-subMain border border-subMain text-white py-3 px-6 rounded w-full sm:w-auto"
          >
            Update Profile
          </button>
        </div>
      </div>
    </SideBar>
  );
}

export default Profile;
