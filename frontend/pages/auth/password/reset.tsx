import { useRouter } from "next/dist/client/router";
import React, { SyntheticEvent, useState } from "react";
import Layout from "../../../components/Layout";
import { ColorSet } from '../../../domain/models/ColorSet';

const Reset = () => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [message, setMessage] = useState("");
  const [notiOpen, setNotiOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      let url_string = window.location.href;
      let url = new URL(url_string);
      let secretCode = url.searchParams.get("code");
      if(secretCode != ''){
          if(password === rePassword){
            setProcessing(true);
            const response = await fetch(
                "http://localhost:8000/api/auth/password/reset/verified/",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    code: secretCode,
                    password: password,
                  }),
                }
              );
              setNotiOpen(true);
              if (response.ok) {
                await router.push("/auth/login");
              } else {
                const content = await response.json();
                setMessage(content.detail);
              }
          }else{
              setNotiOpen(true);
              setMessage('Mật khẩu không trùng nhau');
          }
      }
    } catch (e) {
        setMessage('Lỗi kết nối');
    }
  };

  return (
    <Layout
      auth={false}
      notification={{ open: notiOpen, message: message, setOpen: setNotiOpen }}
    >
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-2xl w-50 min-w-md max-w-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Nhập mật khẩu mới của bạn
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={submit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  Mật khẩu mới
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Mật khẩu mới"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Xác nhận mật khẩu"
                  onChange={(e) => setRePassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`${
                  processing
                    ? ColorSet.BTN_OK
                    : `${ColorSet.BTN_OK} hover:${ColorSet.BTN_OK_HOVER}`
                } flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base rounded-2xl py-2 w-full transition duration-150ease-in`}
                disabled={processing}
              >
                <span className="mr-2 uppercase">Cập nhật</span>
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
      </div>
    </Layout>
  );
};

export default Reset;
