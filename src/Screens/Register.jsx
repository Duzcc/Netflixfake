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

    // Giả lập lưu thông tin người dùng (bạn có thể tích hợp với API thật sau)
    const user = { fullName, email, password };
    localStorage.setItem("registeredUser", JSON.stringify(user));

    // Điều hướng đến login kèm theo thông báo
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
            label="FullName"
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
            Already have an account?{" "}
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
