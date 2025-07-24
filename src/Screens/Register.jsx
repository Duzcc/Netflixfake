import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../Components/UsedInputs";
import Layout from "../Layout/Layout";
import { FiLogIn } from "react-icons/fi";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra email trùng
    const isExist = users.find((user) => user.email === email);
    if (isExist) {
      alert("Email đã được sử dụng. Vui lòng dùng email khác.");
      return;
    }

    const newUser = {
      fullName,
      email,
      password,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Điều hướng về trang login
    navigate("/login", { state: { registered: true } });
  };

  return (
    <Layout>
      <div className="container mx-auto px-2 my-24 flex-colo">
        <form
          onSubmit={handleRegister}
          className="w-full 2xl:w-2/5 gap-8 flex-colo p-8 sm:p-14 md:w-3/5 bg-dry rounded-lg border border-border"
        >
          <img
            src="/images/logo.png"
            alt="logo"
            className="w-full h-12 object-contain"
          />
          <Input
            label="Full Name"
            placeholder="Netflixo React Tailwind"
            type="text"
            bg={true}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Email"
            placeholder="netflixo@gmail.com"
            type="email"
            bg={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            placeholder="*******"
            type="password"
            bg={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-subMain transitions hover:bg-main flex-rows gap-4 text-white p-4 rounded-lg w-full"
          >
            <FiLogIn /> Sign Up
          </button>
          <p className="text-center text-border">
            Already have an account?
            <Link to="/login" className="text-dryGray font-semibold ml-2">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
}

export default Register;
