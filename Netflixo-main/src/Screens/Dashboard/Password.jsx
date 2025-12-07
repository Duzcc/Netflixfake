import React, { useState } from "react";
import { Input } from "../../Components/UsedInputs";
import SideBar from "./SideBar";
import { updatePassword, validatePasswordMatch } from "../../utils/authUtils";

function Password() {
  const [prevPassword, setPrevPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Clear previous message
    setMessage("");

    // Validate all fields are filled
    if (!prevPassword || !newPassword || !confirmPassword) {
      setMessage("All fields are required.");
      setMessageType("error");
      return;
    }

    // Validate password confirmation
    const passwordMatchValidation = validatePasswordMatch(newPassword, confirmPassword);
    if (!passwordMatchValidation.isValid) {
      setMessage(passwordMatchValidation.error);
      setMessageType("error");
      return;
    }

    // Update password using utility
    const result = await updatePassword(prevPassword, newPassword);

    if (result.success) {
      setMessage("Password changed successfully!");
      setMessageType("success");
      // Reset form
      setPrevPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setMessage(result.error);
      setMessageType("error");
    }
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Change Password</h2>

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

        <form className="flex flex-col gap-6" onSubmit={handleChangePassword}>
          <Input
            label="Previous Password"
            placeholder="********"
            type="password"
            value={prevPassword}
            onChange={(e) => setPrevPassword(e.target.value)}
            bg={true}
          />
          <Input
            label="New Password"
            placeholder="********"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            bg={true}
          />
          <Input
            label="Confirm Password"
            placeholder="********"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            bg={true}
          />
          <div className="flex justify-end items-center my-4">
            <button
              type="submit"
              className="bg-main font-medium transitions hover:bg-subMain border border-subMain text-white py-3 px-6 rounded w-full sm:w-auto"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </SideBar>
  );
}

export default Password;
