import React, { useState } from "react";
import { Input } from "../../Components/UsedInputs";
import SideBar from "./SideBar";

function Password() {
  const [prevPassword, setPrevPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (!storedUser) {
      setMessage("No registered user found.");
      return;
    }

    if (prevPassword !== storedUser.password) {
      setMessage("Previous password is incorrect.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    // Cập nhật mật khẩu
    const updatedUser = { ...storedUser, password: newPassword };
    localStorage.setItem("registeredUser", JSON.stringify(updatedUser));
    setMessage("Password changed successfully.");
    // Reset form
    setPrevPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Change Password</h2>

        {message && <p className="text-sm text-subMain font-medium">{message}</p>}

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
