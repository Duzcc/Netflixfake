import React, { useEffect, useState } from "react";
import Uploder from "../../Components/Uploder";
import { Input } from "../../Components/UsedInputs";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateUserProfile, logout } from "../../utils/authUtils";

function Profile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
      setAvatar(user.avatar || null);
    }
  }, []);

  const handleAvatarChange = (base64Image) => {
    setAvatar(base64Image);
  };

  const handleUpdate = async () => {
    const user = getCurrentUser();
    if (!user) {
      setMessage("No user found. Please login again.");
      setMessageType("error");
      return;
    }

    // Validate inputs
    if (!fullName.trim()) {
      setMessage("Full name is required.");
      setMessageType("error");
      return;
    }

    if (!email.trim()) {
      setMessage("Email is required.");
      setMessageType("error");
      return;
    }

    // Update profile
    const result = await updateUserProfile({
      name: fullName.trim(),
      email: email.trim(),
      image: avatar, // Note: Backend expects 'image', not 'avatar'
    });

    if (result.success) {
      setMessage("Profile updated successfully!");
      setMessageType("success");

      // Dispatch event to update navbar
      window.dispatchEvent(new Event("userProfileUpdated"));
    } else {
      setMessage(result.error || "Failed to update profile. Please try again.");
      setMessageType("error");
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    const user = getCurrentUser();
    if (!user) return;

    // Remove user from users array
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.filter((u) => u.email !== user.email);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Logout
    logout();

    alert("Account deleted successfully.");
    navigate("/login");
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Profile</h2>

        {message && (
          <div
            className={`p-3 rounded text-sm ${messageType === "success"
              ? "bg-green-600 bg-opacity-20 border border-green-600 text-green-500"
              : "bg-red-600 bg-opacity-20 border border-red-600 text-red-500"
              }`}
          >
            {message}
          </div>
        )}

        <Uploder onImageSelect={handleAvatarChange} currentImage={avatar} />

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

