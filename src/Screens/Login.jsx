import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "../Components/UsedInputs";
import Layout from "../Layout/Layout";
import { FiLogIn } from "react-icons/fi";

// Giả lập tài khoản hợp lệ (có thể dùng localStorage thực tế ở bước sau)
const fakeUser = {
  email: "netflixo@gmail.com",
  password: "123456",
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Hiển thị thông báo khi vừa đăng ký
  useEffect(() => {
    if (location.state?.registered) {
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
    }
  }, [location.state]);

  const handleLogin = (e) => {
    e.preventDefault();

    // Có thể lấy dữ liệu từ localStorage để kiểm tra
    const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));

    const isValid =
      (registeredUser &&
        email === registeredUser.email &&
        password === registeredUser.password) ||
      (email === fakeUser.email && password === fakeUser.password);

    if (isValid) {
      localStorage.setItem("user", JSON.stringify({ email }));
      alert("Đăng nhập thành công!");
      navigate("/"); // 👉 CHUYỂN VỀ TRANG CHỦ
    } else {
      alert("Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-2 my-24 flex-colo">
        <form
          onSubmit={handleLogin}
          className="w-full 2xl:w-2/5 gap-8 flex-colo p-8 sm:p-14 md:w-3/5 bg-dry rounded-lg border border-border"
        >
          <img
            src="/images/logo.png"
            alt="logo"
            className="w-full h-12 object-contain"
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
            <FiLogIn /> Sign In
          </button>
          <p className="text-center text-border">
            Don't have an account?{" "}
            <Link to="/register" className="text-dryGray font-semibold ml-2">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
