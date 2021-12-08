import { useRouter } from "next/dist/client/router";
import React, { SyntheticEvent, useState } from "react";
import Layout from "../../components/Layout";
import Image from "next/image";
import { LockClosedIcon } from "@heroicons/react/solid";
import { ColorSet } from "../../domain/models/ColorSet";
import { Link } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);

  const [message, setMessage] = useState(
    "Xin nhập bằng tài khoản bạn đã đăng ký."
  );

  const router = useRouter();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setNotiOpen(false);
    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        await router.push("/");
      } else {
        const content = await response.json();
        setNotiOpen(true);
        setMessage(content.detail);
      }
    } catch (e) {}
  };

  return (
    <Layout auth={isAuthenticated} notification={{open:notiOpen, message:message, setOpen:setNotiOpen}}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-3xl w-50 min-w-md max-w-md">
          <div className="font-medium self-center text-xl sm:text-3xl text-gray-800">
            Xin chào bạn
          </div>
          <div className="mt-4 self-center text-xl sm:text-sm text-gray-800">
            Xin nhập bằng tài khoản bạn đã đăng ký.
          </div>

          <div className="mt-10">
            <form onSubmit={submit}>
              <div className="flex flex-col mb-5">
                <label
                  htmlFor="email"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  Địa chỉ email
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <i className="fas fa-at text-blue-500"></i>
                  </div>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    className="text-sm placeholder-gray-500 pl-4 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Nhập email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="password"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <span>
                      <i className="fas fa-lock text-blue-500"></i>
                    </span>
                  </div>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    required
                    className="text-sm placeholder-gray-500 pl-4 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Nhập mật khẩu"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex w-full">
                <button
                  type="submit"
                  className={`${
                    processing ? ColorSet.BTN_OK : `${ColorSet.BTN_OK} hover:${ColorSet.BTN_OK_HOVER}`  
                  } flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base rounded-2xl py-2 w-full transition duration-150ease-in`}
                  disabled={processing}
                >
                  <span className="mr-2 uppercase">Đăng nhập</span>
                  <svg
                    className={`${processing ? "animate-spin" : ""} h-6 w-6`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span></span>
                </button>
              </div>
            </form>
          </div>
          <div className="flex justify-center items-center text-gray-700 font-medium text-xs text-center mt-6">
            <span className="ml-2">
              Quên mật khẩu....!
              <Link href="/auth/password">
                <a className="text-xs ml-2 text-blue-500 font-semibold">
                  Khôi phục
                </a>
              </Link>
            </span>
            </div>
        </div>
        <div className="flex justify-center items-center text-gray-700 font-medium text-xs text-center mt-6">
            <span className="ml-2">
              Bạn chưa có tài khoản?
              <Link href="/auth/signup">
                <a className="text-xs ml-2 text-blue-500 font-semibold">
                  Đăng ký
                </a>
              </Link>
            </span>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
