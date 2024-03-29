import { Fragment, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Dialog, Menu, Tab, Transition } from "@headlessui/react";
import {
  MenuIcon,
  SearchIcon,
  ChevronDownIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/dist/client/router";
import { navigation } from "../domain/models/Navigation";

type Props = {
  auth: boolean;
};

const Header = (props: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const logout = async () => {
    await fetch("http://localhost:8000/api/auth/logout", {
      method: "get",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    await router.push("/auth/login");
  };
  let mobile_menu;
  let desktop_menu;
  if (!props.auth) {
    mobile_menu = (
      <div className="border-t border-gray-200 py-6 px-4 space-y-6">
        <div className="flow-root">
          <Link href={navigation.auth.login.href}>
            <a className="-m-2 p-2 block font-medium text-gray-900">
              {navigation.auth.login.name}
            </a>
          </Link>
        </div>
        <div className="flow-root">
          <Link href={navigation.auth.signup.href}>
            <a className="-m-2 p-2 block font-medium text-gray-900">
              {navigation.auth.signup.name}
            </a>
          </Link>
        </div>
      </div>
    );
    desktop_menu = (
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
        <Link href={navigation.auth.login.href}>
          <a className="text-sm font-medium text-gray-700 hover:text-gray-900">
            {navigation.auth.login.name}
          </a>
        </Link>
        <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
        <Link href={navigation.auth.signup.href}>
          <a className="text-sm font-medium text-gray-700 hover:text-gray-900">
            {navigation.auth.signup.name}
          </a>
        </Link>
      </div>
    );
  } else {
    mobile_menu = (
      <div className="border-t border-gray-200 py-6 px-4 space-y-6">
        <div className="flow-root">
          <a
            href="#"
            className="-m-2 p-2 block font-medium text-gray-900"
            onClick={logout}
          >
            {navigation.auth.logout.name}
          </a>
        </div>
      </div>
    );
    desktop_menu = (
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
        <a
          href="#"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
          onClick={logout}
        >
          {navigation.auth.logout.name}
        </a>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <div className="bg-whilte">
        {/* Mobile menu */}
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 lg:hidden"
            onClose={setOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto">
                <div className="px-4 pt-5 pb-2 flex">
                  <button
                    type="button"
                    className="-m-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <h4 className=" mt-6 text-center text-2xl text-gray-900">
                  Giáo đoàn công giáo Việt Nam tại Nhật Bản
                </h4>
                {/* Links */}
                {navigation.tabs.map((tab) => (
                  <div
                    key={tab.name}
                    className="border-t border-gray-200 py-6 px-4 space-y-6"
                  >
                    <p
                      id={`${tab.id}--heading-mobile`}
                      className="-m-2 p-2 block font-medium text-gray-900"
                    >
                      {tab.name}
                    </p>
                    <ul
                      role="list"
                      aria-labelledby={`${tab.id}-heading-mobile`}
                      className="mt-6 flex flex-col space-y-6"
                    >
                      {tab.items.map((item) => (
                        <li key={item.name} className="flow-root">
                          <a
                            href={item.href}
                            className="-m-2 p-2 block text-gray-500"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {mobile_menu}
                <div className="border-t border-gray-200 py-6 px-4 space-y-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <a
                        href={page.href}
                        className="-m-2 p-2 block font-medium text-gray-900"
                      >
                        {page.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>
        <header className="relative bg-white">
          <h4 className=" mt-6 text-center md:text-3xl text-2xl text-gray-900 ">
            Giáo đoàn công giáo Việt Nam tại Nhật Bản
          </h4>
          <nav
            aria-label="Top"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 top=0"
          >
            <div className="border-b border-gray-200">
              <div className="h-16 flex items-center">
                <button
                  type="button"
                  className="bg-white p-2 rounded-md text-gray-400 lg:hidden"
                  onClick={() => setOpen(true)}
                >
                  <span className="sr-only">Open menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Logo */}
                <div className="ml-4 flex lg:ml-0">
                  <Link href="/">
                    <a>
                      <span className="sr-only">VietcatholicJp</span>
                      <svg
                        className="h-18 w-12 md:h-32 md:w-24"
                        fill="#AB7C94"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        stroke="currentColor"
                        viewBox="100 0 700 700"
                      >
                        <g id="PNPgcd_1_"></g>
                        <path
                          d="M424.7,157c2.7-0.5,4.7-0.8,6.8-1.1c1.5-0.2,3.1-0.2,4.6,0.1c1.1,0.2,2.3,0.5,2.5,1.8c0.2,1.3-0.9,1.9-1.9,2.4
                        c-1.6,0.9-3.4,1.3-5.2,1.7c-4.1,0.7-8.2,0.7-12.3,0.5c-1.5-0.1-2.6,0.3-3.7,1.3c-2.7,2.4-5.6,4.6-7.9,7.6c2-0.7,3.9-1.3,5.9-2
                        c2.5-0.8,5-1.2,7.6-0.8c1,0.1,2.1,0.3,2.4,1.5c0.3,1.2-0.6,1.9-1.4,2.4c-2.2,1.5-4.6,2.1-7.1,2.6c-3.6,0.8-7.2,1.1-10.9,1.1
                        c-0.9,0-1.8-0.1-2.5,0.7c-2.3,2.7-4.8,5.2-6.6,8.4c15.8-10.4,33.6-13.9,52.5-14.8c-1.9,4.6-3.5,8.9-5.3,13.1
                        c-2.6,6.5-5.3,13-7.9,19.5c-2,4.9-4.8,9.2-8.6,12.9c-1.2,1.2-1.8,2.3-1.8,4c0,1.7-0.4,3.4-0.7,5.5c3.2-2.6,5.7-5.4,8.1-8.2
                        c0.6-0.8,0.5-1.4,0.2-2.2c-0.9-3.1,0.7-5.9,3.6-6.6c2.7-0.6,5.4,1.1,6,3.8c0.7,3-1.1,5.4-4.4,6c-0.7,0.1-1.4,0.2-1.9,0.9
                        c-1.7,2.4-3.8,4.4-5.6,6.7c4.4-2,8.3-4.7,12-7.8c0.6-0.5,1-1,1.6-1.5c2.2-1.8,3.3-3.7,2.1-6.8c-1.1-2.8-1-5.9,0-8.9
                        c0.6-1.7,1.3-3.4,3.4-3.5c2.1-0.1,2.9,1.6,3.6,3.2c0.3,0.7,0.5,1.3,0.8,2.1c1.6-0.4,3-1.5,4.7-1.6c2.6-0.1,3.7,1.1,3.4,3.6
                        c-0.2,1.3-0.8,2.4-1.6,3.4c-1.5,2.1-3.5,3.9-5.8,4.9c-3.1,1.4-5.4,3.5-7.6,6c-2.2,2.5-5.1,4.4-7.6,6.8c3.5-0.2,7-0.4,10.5-0.7
                        c17.3-1.2,34.6-2.5,51.9-3.8c1.8-0.1,3,0.3,4.3,1.7c8.1,8.8,16.3,17.5,24.4,26.3c0.4,0.4,0.7,0.8,1.3,1.5c-4.1,4-8.1,8-12.1,12
                        c-4.5,4.4-9,8.8-13.4,13.3c-1.5,1.5-3,2-5.1,1.9c-20.6-1.2-41.2-2.2-61.8-3.5c-2.9-0.2-4.8,1-7,2.8c3.7,1.1,7.1,2,10.5,3.1
                        c1.1,0.3,1.7-0.3,2.5-0.7c2.3-1.2,4.7-0.8,6.3,0.9c1.5,1.7,1.6,4.4,0.4,6.4c-1.3,2.1-4,3.1-6.2,2.3c-1.1-0.4-2.2-0.9-2.5-2
                        c-0.6-2.1-2.2-2.4-3.9-2.9c-4.2-1.2-8.4-2.4-12.6-3.7c-1.8-0.6-3.5-0.7-5.7,0.3c1.2,0.4,2.2,0.7,3.1,1c8.4,2.7,15.6,7.2,21.2,13.9
                        c7.7,9.1,15.3,18.4,23,27.6c0.3,0.3,0.7,0.6,0.6,1.5c-21.5,5.9-42.7,5.7-63.7-3.2c0.7,1.4,2.8,1.8,1.9,3.4c-0.7,1.4-2.4,1.1-3.7,1.1
                        c-1.4,0-2.7-0.4-4-0.7c-1.2-0.3-2.4-0.8-3.9-0.8c1.5,1.9,3.1,3.7,4.6,5.6c0.7,0.9,1.6,0.8,2.5,0.7c3.6-0.3,7.3-0.4,10.9,0
                        c1.7,0.2,3.4,0.5,5.1,1.1c1.2,0.5,2.9,1,2.8,2.6c-0.1,1.8-2,2-3.4,2.2c-3,0.5-6,0-9-0.6c-1.2-0.3-2.4-0.6-3.8-0.7
                        c2.9,3.4,6.1,6.4,9.5,9.2c1,0.8,2.1,0.4,3.2,0.3c4.6-0.4,9.1-0.1,13.6,0.8c1.5,0.3,3,0.8,4.3,1.7c0.7,0.5,1.3,1,1.2,2
                        c-0.2,1-1,1.3-1.8,1.6c-1.7,0.5-3.4,0.5-5.2,0.4c-2.9-0.2-5.7-1.1-8.6-1.6c2.3,1.9,4.6,3.8,7.5,4.9c3.4,1.3,6.8,2.8,9.5,5.4
                        c1.2,1.2,2.9,2.5,1.9,4.4c-1.1,2-3.3,1.3-5,0.8c-3.8-1.2-7-3.6-9.7-6.5c-4.2-4.5-9.7-7.2-14.5-11.1c0.8,1.6,1.6,3.2,2.4,4.8
                        c1.1,2.4,2,4.9,2,7.6c0,1.1,0,2.3-1.3,2.8c-1.2,0.5-2-0.6-2.7-1.3c-1.4-1.6-2.3-3.5-3-5.5c-1.3-3.4-2.5-7-2.7-10.6
                        c-0.2-3.7-2.4-5.7-4.8-7.8c-0.5,0.9-0.1,1.7,0,2.4c0.3,2.7,0.8,5.5-1.2,7.8c-0.4,0.5-0.2,1.1,0,1.5c5.3,15.8,2.3,30.6-5.1,44.9
                        c-3.3,6.3-7,12.4-11,18.4c-3-1.1-4.9-3.5-7.3-5.1c-0.8,0.4-0.5,1-0.4,1.5c0.8,23.1,1.7,46.2,2.6,69.3c1.1,28.7,2.2,57.5,3.2,86.2
                        c0.1,3.3,0.2,6.6,0.5,9.8c0.1,1.5-0.4,2.3-1.6,3.1c-3.9,2.7-8,5.2-11.6,8.3c-1.9,1.6-4.1,2.4-5.9,3.9c-1.9,1.5-4,2.8-6,4.3
                        c-2.1,1.5-4.2,2.9-6.4,4.5c-5.6-4-11.1-7.9-16.5-11.8c-4.1-2.9-8.1-5.9-12.3-8.7c-1.5-1-2.1-2.2-2-4c0.7-18.8,1.4-37.6,2.1-56.4
                        c1.4-38.5,2.7-77,4-115.5c0.2-6,0.4-12,0.7-18.2c-1.2,0.1-1.7,1.1-2.8,1.4c-2.3-2.8-3.8-6.1-6-9.1c-1,2.3-1.1,4.2,0.5,6.2
                        c1.8,2.3,2.9,5,3.3,8c0.1,0.6,0.2,1.3,0.1,1.9c-0.2,4.2-2,5.2-6.2,3.2c0,2.9,0,5.7,0,8.4c0,0.9,0.8,1.3,1.4,1.9
                        c1.9,1.9,3.5,4,4.5,6.5c0.5,1.2,0.9,2.4,1,3.7c0.1,1.6,0.1,3.2-1.5,4.1c-1.6,0.9-3,0-4.3-1c-0.7-0.5-1.4-1.2-2.1-1.8
                        c-1.1,1.1-1.8,2.4-3,3.3c-2.4,1.8-4.6,1-5.3-1.9c-0.5-2.3,0.2-4.5,1-6.7c0.3-0.9,0.7-2,1.3-2.7c4-4.2,2.8-9.3,2.9-14.2
                        c-0.3,0-0.5-0.1-0.6,0c-1.4,0.7-2.8,1.6-4.3,0.4c-1.5-1.2-1.3-3-1-4.6c0.7-3.7,2.9-6.7,5.6-9.2c1.3-1.2,1.7-2.6,2.2-4.2
                        c1.6-5.2,0.7-9.8-2.2-14.2c-1-1.6-1.6-3.5-2.5-5.4c-1.3,1.2-1.6,2.3-1.1,3.9c0.9,2.6,1,5.4,0.7,8.1c-0.1,1.3-0.4,2.5-1,3.7
                        c-1.6,3.5-3.4,3.9-6.5,1.3c-1.1,1.9-1.5,4.1-2.3,6.1c-0.4,1,0.2,1.8,0.6,2.6c1.4,2.9,2.3,6,2.1,9.2c-0.1,0.8-0.2,1.6-0.4,2.4
                        c-0.4,1.5-1,2.8-2.7,3.2c-1.7,0.3-2.7-0.9-3.6-2.1c-0.6-0.8-1-1.7-1.6-2.6c-1.4,0.7-2.5,1.7-3.9,2.1c-2.9,0.9-4.7-0.6-4.3-3.6
                        c0.2-1.7,1-3.1,1.9-4.5c1.1-1.5,2.2-3,3.8-3.9c3.3-1.9,4.8-4.7,5.7-8.2c0.3-1.1,0.7-2.1,1.1-3.1c-0.7-0.6-1.4-0.2-2.1-0.2
                        c-3,0-4.2-1.7-3.1-4.5c0.9-2.4,2.7-4.1,4.8-5.5c0.9-0.6,1.9-1.1,2.8-1.7c1.7-0.9,3.5-1.4,4.7-3.4c1.9-3.2,2.3-6.1,1.3-9.7
                        c-2-7.3-2.1-14.8-0.8-22.3c0.1-0.3,0-0.6,0.1-1.6c-1.5,2.3-2.7,4.1-3.9,5.9c-0.6,0.8-0.1,1.6,0.1,2.4c1,4.4,1.9,8.7,1.7,13.3
                        c-0.1,1.9-0.3,3.8-1.3,5.5c-1,1.8-2.5,1.8-3.6,0.1c-1.2-1.8-1.5-3.9-1.6-6c-0.2-2.9-0.1-5.8,0.1-8.9c-1.9,2.2-3.8,4.3-5.6,6.5
                        c-0.7,0.8-0.4,1.9-0.5,2.9c-0.1,3.8-0.6,7.5-1.8,11c-0.5,1.5-1.2,2.9-2.3,4c-1.7,1.7-3.5,1.3-4-1.1c-0.6-2.4,0-4.7,0.6-7
                        c0.2-0.6,0.4-1.2,0.4-1.9c-4.2,4.1-9.4,7-12.9,11.7c-2.2,2.8-4.7,5.4-7.8,7.3c-2.5,1.6-4.7,1.8-5.8,0.7c-1.2-1.2-0.9-3.6,0.8-6
                        c2.5-3.5,5.9-5.8,9.9-7.1c4-1.3,6.7-4.2,9.7-6.8c-2.3,0.6-4.5,1.4-6.8,1.7c-2.5,0.4-4.9,0.6-7.3-0.4c-1.1-0.4-2-1-2.1-2.3
                        c-0.1-1.2,0.7-2,1.6-2.7c2.4-1.5,5.1-2,7.8-2.2c3.5-0.2,7-0.3,10.4,0.4c1.5,0.3,2.6-0.1,3.6-1.2c2.3-2.5,4.7-4.9,7-8
                        c-3.5,1.3-6.5,2.6-9.7,3.1c-1.9,0.3-3.8,0.5-5.7,0.1c-1-0.2-2-0.6-2.2-1.8c-0.2-1,0.5-1.7,1.2-2.3c1.4-1.1,2.9-1.8,4.6-2.3
                        c4.5-1.5,9.1-1.8,13.8-1.9c1.6,0,2.7-0.5,3.6-1.9c3-4.5,5.9-9,8.2-14c-8,7.1-17.3,11.9-27.4,15c-10.1,3.1-20.5,4.5-30.9,5
                        c-0.5-1,0.1-1.7,0.4-2.4c4.5-10.4,8.6-20.9,12.8-31.4c2.8-7.1,7.6-13.1,12.5-18.9c0.6-0.7,1.2-1.4,1.8-2c-1.5-1-1.5-1.1-2.7,0.1
                        c-4,3.9-8.2,7.5-12.9,10.6c-2.8,1.9-5.8,3.5-9,4.6c-1.1,0.4-1.9,1.1-2.6,1.9c-2.2,2.3-4.7,4.3-7.8,5.4c-3.1,1.2-5.9,0.9-6.9-0.6
                        c-1-1.5-0.3-3.5,2.3-6.1c0.3-0.3,0.6-0.5,0.9-0.7c-0.8-0.7-1.5-1.3-2.2-1.9c-1.2-1.1-2.2-2.4-1.6-4.1c0.6-1.8,2.4-2.1,4.1-2.1
                        c3.2-0.1,6.3,0.8,8.7,2.8c2.7,2.3,5,1.6,7.6,0.2c4.8-2.6,9.1-5.9,13-9.8c-2.8,1.1-5.7,2.3-8.5,3.4c-0.8,0.3-1,1-1.3,1.6
                        c-1.6,2.6-4.6,3.5-7,2c-2.4-1.4-3.1-4.6-1.7-6.9c1.6-2.6,4.7-3.2,7.4-1.2c1,0.7,1.7,0.8,2.7,0.4c3-1.2,5.9-2.4,9.1-4.3
                        c-3.2-0.3-6,0-8.7,0.2c-15.1,0.8-30.3,1.7-45.4,2.6c-3.9,0.2-7.8,0.4-11.8,0.6c-1.1,0.1-2.1-0.1-3-1c-8.6-8.6-17.2-17.1-25.8-25.7
                        c-0.1-0.1-0.2-0.3-0.5-0.7c2.5-2.7,5.1-5.5,7.7-8.3c6.1-6.5,12.1-12.9,18.1-19.4c1.2-1.3,2.4-1.7,4.1-1.5
                        c19.9,1.5,39.9,2.9,59.8,4.3c3.2,0.2,6.4,0.5,9.7,0.7c-0.7-0.8-1.6-0.9-2.4-1.1c-9-2.8-16.7-7.6-22.7-15.1
                        c-6.7-8.3-13.6-16.4-20.5-24.7c-0.5-0.6-1-1-1.2-2c3.9-1.3,7.8-2.1,11.8-2.8c12.8-2.4,25.5-3.1,38.3-0.3c8.4,1.8,16.1,5.2,23.2,10.1
                        c1.7,1.2,1.7,1.2,4,0.7c-1.7-3-3.8-5.5-6-8c-0.7-0.8-1.7-0.5-2.6-0.5c-4.6-0.2-9.1-0.8-13.5-2.2c-1.6-0.5-3.1-1.2-4.4-2.2
                        c-0.7-0.6-1.4-1.3-1.1-2.3c0.3-1,1.3-1.3,2.2-1.4c1.5-0.2,3.1-0.1,4.6,0.2c3.4,0.7,6.6,2,9.8,3.3c-3.1-3.8-6.7-7.1-10.4-10.2
                        c-0.8-0.7-1.7-0.4-2.6-0.3c-4.8,0.3-9.5,0.3-14.2-0.8c-1.1-0.3-2.3-0.7-3.4-1.1c-1.1-0.5-2.4-1.1-2.2-2.5c0.2-1.5,1.7-1.8,3-1.9
                        c2.5-0.3,4.9-0.2,7.3,0.4c1.7,0.4,3.3,0.8,5.6,1.4c-2.3-2-4.2-3.5-6.6-4.2c-3.9-1.2-7.6-2.6-11-4.8c-1.6-1.1-3.1-2.2-4.1-3.9
                        c-1.4-2.4-0.4-4.4,2.4-4.7c2.7-0.3,5,0.7,7.3,1.9c3.1,1.7,5.6,4.1,7.8,6.8c1.6,1.9,7.2,6.2,9.9,7.5c0.1-1-0.5-1.8-0.8-2.6
                        c-0.6-1.5-1.1-3.1-1.2-4.8c-0.1-1.4-0.5-3.2,1.2-3.9c1.7-0.6,2.6,1,3.4,2.1c2.6,3.8,3.8,8.1,4.6,12.5c0.4,2.6,1.4,4.6,3.4,6.2
                        c2,1.6,3.8,3.4,5.6,5.1c-0.3-1.3-0.6-2.8-1-4.3c-0.4-1.9-0.6-3.8-0.4-5.7c0.1-1.4,0.2-3,1.9-3.3c1.6-0.2,2.2,1.4,2.8,2.6
                        c1.1,2.4,1.6,5,1.9,7.7c0.2,1.5,0.4,2.9,0.3,4.4c-0.5,4.3,1,7.7,3.7,11c2.3,2.9,4.1,6.2,6.2,9.4c1.6-0.7,3.2-1.4,4.9-2.2
                        c-1.2-2.6-2.8-4.7-4.2-7c-5.8-9.5-11.2-19.3-14-30.2c-3.1-11.9-1.9-23.3,2.8-34.6c3.7-8.8,8.6-16.9,13.9-24.8
                        c0.1-0.2,0.4-0.4,0.7-0.7c2.3,1.1,4.1,2.9,6.4,4.6c0.1-3.1-0.3-6-0.6-8.8c-0.1-1.3,0-2.4,1.1-3.4c9.6-9.2,19.2-18.5,28.8-27.7
                        c0.3-0.2,0.6-0.4,0.9-0.7c6.4,6,12.7,11.9,19,17.8c3.6,3.4,7.1,6.9,10.8,10.1c1.4,1.3,1.7,2.6,1.5,4.3c-0.9,9.4-1.7,18.9-2.6,28.4
                        c-0.2,2.3,0.3,4.1,1.6,5.8c1,1.4,1.8,2.9,3,4.8c1.6-5.4,2.6-10.5,3.2-15.7c0.1-1-0.7-1.7-1.2-2.4c-1.8-2.6-3.2-5.3-3.6-8.5
                        c0-0.4-0.1-0.7-0.1-1.1c-0.2-4.4,1.8-5.9,6-4.1c0.5-2.8,0.2-5.6,0.1-8.4c0-0.9-0.9-1.3-1.5-1.9c-2.1-2.1-3.8-4.4-4.9-7.2
                        c-0.1-0.3-0.3-0.7-0.4-1c-0.4-2.1-1-4.4,1-5.8c2.2-1.4,3.9,0.3,5.5,1.7c0.3,0.2,0.6,0.5,0.9,0.7c1-0.6,1.4-1.7,2.2-2.4
                        c1.2-1,2.3-2.3,4.1-1.7c1.9,0.6,2.2,2.3,2.3,4c0.1,3.4-1,6.6-3,9.2c-1.9,2.4-2.4,4.9-2.2,7.9c0.1,1.8,0,3.6,0,5.6
                        c1.9-0.8,3.5-2.1,5.1-0.6c1.7,1.6,1.3,3.7,0.7,5.6c-0.9,3.2-2.9,5.9-5.3,8.2c-1.1,1.1-1.8,2.2-2,3.7c-0.7,5.9-2,11.7-3.7,17.4
                        c-0.4,1.2-0.4,2.2,0.2,3.4c1.8,3.5,3.3,7.1,4.7,11.3c2.4-3.3,4-6.6,5.7-9.9c0.4-0.7-0.1-1.4-0.3-2.1c-0.7-2.6-1-5.2-0.8-7.9
                        c0.1-1.4,0.4-2.7,1-4c1.6-3.4,3.5-3.8,6.5-1.1c0.8-2.2,1.5-4.3,2.2-6.4c0.3-0.9-0.2-1.6-0.6-2.3c-1.4-2.8-2.3-5.8-2.3-8.9
                        c0-1,0.2-2,0.4-3c0.4-1.4,1.1-2.8,2.7-3.1c1.6-0.2,2.5,0.8,3.4,1.9c0.6,0.8,1.1,1.7,1.7,2.8c1.3-0.7,2.5-1.7,3.9-2.2
                        c2.9-0.9,4.8,0.6,4.3,3.6c-0.6,3.4-2.5,6.3-5.2,8.1c-3.7,2.3-5.2,5.6-6.2,9.5c-0.2,0.8-0.5,1.5-0.8,2.3c0.6,0.7,1.3,0.2,1.9,0.2
                        c3.3-0.1,4.5,1.7,3.3,4.7c-1.2,2.7-3.2,5-5.8,5.9c-4.6,1.6-6.6,5.3-8.6,9.2c-1.4,2.7-3.6,5-4.5,7.8c-0.9,2.8,0.5,5.9,0.5,8.9
                        c0.1,5.3-0.7,10.5-2.1,16.1c2.9-2.9,4.8-5.5,4.5-9.5c-0.4-4.4,0.3-8.8,1.9-12.9c0.6-1.5,1.2-3.6,3.2-3.2c2,0.4,1.8,2.5,1.9,4.1
                        c0.2,3.4-0.9,6.6-1.5,10c2.5-2.1,5.2-3.8,5.7-7.6c0.4-4.2,1.8-8.2,4-11.9c0.9-1.5,1.9-3.8,3.9-3.1c2.2,0.8,1.3,3.3,1.1,5.1
                        c-0.3,2.2-1.5,4.2-2.2,6.6c3.8-2.7,7.4-5.2,11-7.7c0.9-0.6,1.5-1.6,2.2-2.4c2.4-3.1,5.1-5.8,8.5-7.6c1.8-1,3.7-1.6,5.8-1.4
                        c2.3,0.2,3.2,1.7,2.3,3.8c-0.8,1.9-2.4,3.2-4,4.4c-2.9,2.1-6.1,3.6-9.4,4.9C428.4,154.3,426.8,155.4,424.7,157z M341.8,260.5
                        c0.1-0.2,0.2-0.3,0.3-0.5c-1.1-1.3-2.2-2.7-3.2-4c-5.2-6.7-9.9-13.8-12.7-21.9c-2-6-3-12-0.5-18.2c0.3-0.7,0.2-1.4,0.1-2.2
                        c-0.4-2.9-1-5.7-2.1-8.5c-2.4-5.9-6.1-7.2-11.8-4.1c-2,1.1-3.8,2.6-5.6,3.8c-2.1,1.4-3.6,0.6-3.6-1.9c0-1.6,0-3.3-0.4-4.9
                        c-0.6-2.6-1.8-3.3-4.4-2.4c-1.7,0.6-3.1,1.5-4.4,2.7c-6.4,5.9-9.8,13.3-10.4,21.9c-0.7,9,2.6,17,7.3,24.5
                        c3.8,6.1,9.2,10.5,15.9,13.3c9.9,4,20.3,4.5,30.8,4.1c-4.4-2.7-8.8-5.5-12.7-9c-3.9-3.5-7.3-7.5-9.5-12.4
                        C321.7,250.7,331.2,256.4,341.8,260.5z M370.3,262.9c8.9-1.5,17.4-4.1,25.3-8.4c12.4-6.7,20.6-16.6,23.6-30.6
                        c0.7-3.3,1.1-6.7,0.3-10c-0.9-3.8-3.2-6.1-6.7-6.7c-2.8-0.5-5.4,0.2-7.9,1.6c-1.3,0.7-2.4,1.7-3.5,2.6c-1.6,1.3-2.8,0.8-3.4-1.2
                        c-0.2-0.5-0.2-1.1-0.3-1.6c-1.4-7.1-4.8-8.5-10.8-4.6c-4.8,3.2-8.4,7.5-11.8,12.1c-0.7,0.9-0.5,1.7-0.2,2.6c1,2.9,1.4,5.8,1.5,8.9
                        c0.3,9.6-2.8,18.1-8.2,25.9c-0.5,0.8-1.3,1.5-1.7,3c6.1-4.9,10.6-10.5,14.4-16.7c-3.5,8.7-9,16-16,22.2c7.7-2.6,14.4-6.8,20.5-12
                        C381.1,255.1,376,259.3,370.3,262.9z M351.1,273.1c-1.1,6.1-1.4,11.6,0.3,17.1c3.6,11.4,11.9,18,23,21.4c2.8,0.9,5.8,0.8,8.7,0
                        c5.4-1.5,8.3-5.7,7.8-11.3c-0.3-3,0.3-3.5,3.3-3.2c3.3,0.4,6.6,0.6,9.8-0.3c4.2-1.2,5.8-3.7,5.1-8c-0.8-4.6-2.8-8.5-6.7-11.2
                        c-2.3-1.7-4.9-2.9-7.5-3.8c-7.7-2.7-15.8-3.8-23.9-4.3c-4.1-0.2-8.3-0.6-12.5-0.1c6,3.8,12.2,7.2,17.9,11.4c-7.4-2.9-14.5-6.4-22-9
                        c2.2,4.4,4.7,8.4,7.4,12.3c2.8,3.9,6,7.4,9.6,10.5C362.6,289.6,357.1,281.6,351.1,273.1z M312.1,282.2c6.7-8.3,16-12.5,26.1-15.3
                        c-4.3-0.4-8.5-0.4-12.7,0.2c-9.1,1.5-17.5,4.5-24.2,11.2c-3.7,3.7-6,8.2-6.3,13.6c-0.2,4,0.2,7.9,4.2,9.9c3.9,2,7.4,0.4,10.6-2.1
                        c1.8-1.4,2.6-1.3,4,0.5c2.3,3,5,5.6,8.2,7.6c4.4,2.7,9.1,3.8,14.1,2.5c6.2-1.7,10.9-5.6,15.1-10.2c-5.3-10.7-5.4-11.3-4.5-27.8
                        c-5.9,2.6-10,7-13.3,12.3c1.7-6,5.4-10.7,10.1-14.7C331.7,270.5,321,273.8,312.1,282.2z M355.5,261c3.2-2.4,5.9-5.2,8.2-8.3
                        c5.7-7.7,9.2-16.2,8.6-25.9c-0.2-4.7-1.5-9.2-4.4-13c-3.8-4.9-8.8-5.2-13.1-0.7c-1.1,1.1-1.9,2.4-2.8,3.7c-1.2,1.7-2.4,1.8-3.7,0.2
                        c-1.2-1.5-2.5-2.9-4.2-3.8c-6.4-3.7-13.5-0.8-15.4,6.2c-0.5,1.9-0.7,3.9-0.5,6c0.3,2.3,0.7,4.5,1.4,6.7
                        c3.6,10.8,10.3,19.5,17.8,27.8c-1.5-6.1-3.1-12.2-2.8-18.5c1.5,6.7,3.6,13.2,7.1,19.5c3.6-5,5.3-10.3,6.7-15.8
                        C358.5,250.5,357.2,255.7,355.5,261z M372.4,213c2.3-3,4.6-5.7,7.2-8.2c0.5-0.5,0.6-1.1,0.6-1.7c-0.5-4.9-1.2-9.8-3.7-14.2
                        c-2.6-4.5-6.7-6.3-11.8-5.5c-3.8,0.6-7.3,2.3-10.6,4.3c-3.2,2-3.4,1.9-5-1.5c-2-4.5-5.3-6.4-9.8-5.7c-1.9,0.3-3.7,1.1-5.2,2.2
                        c-5.3,3.8-8,9.1-9.1,15.3c-0.1,0.4-0.1,1,0.1,1.3c2.4,3.3,3.3,7.1,4.4,11.1c2.6-1.9,5.3-2.9,8.3-3.2c0.3-2.5-0.9-4.9,0.3-7.8
                        c0.5,2.6,0.9,4.5,1.8,6.4c0.3,0.7,0.6,1.6,1.5,1.8c1.8,0.3,3.4,1.3,5.2,1.8c0.4-1.8-0.1-3.6,0.6-6c0.9,3.3,1.2,6.2,3,8.6
                        c2.3-2.5,4.5-5.5,7.9-5.8c4.1-0.4,5.4-2.5,5.7-6c0-0.1,0.2-0.1,0.5-0.3c0.1,1.6,0.3,3.2,0.4,4.7c0.1,0.7,0,1.5,0.8,1.8
                        C368.3,208,370.4,210.3,372.4,213z M388.9,267.3c0.2,0.8,0.8,0.7,1.2,0.8c6.2,1.5,12.1,3.6,16.9,8c0.6,0.5,1.2,0.7,2,0.8
                        c4.5,0.6,9,0.6,13.3-0.6c9.8-2.8,17.1-8.5,19.8-18.8c1.4-5.1-0.7-8.1-5.9-9.1c-2.3-0.4-4.7-0.5-7.1-0.2c-3.4,0.5-3.9,0-3.6-3.4
                        c0.1-0.8,0.1-1.6,0.1-2.5c-0.2-2.9-2.1-4.2-4.9-3.6c-2.1,0.5-3.9,1.5-5.1,3.4c-0.9,1.5-2,2.8-3.2,4.1c-7.7,8.7-17.6,13.7-28.4,17.4
                        c-0.6,0.2-1.4,0.2-1.7,1.1c9.5,0.5,18.5-0.6,27-4.6C403.2,264.3,396.3,266.3,388.9,267.3z M306.7,268.8c-1.9-0.2-3.9-0.3-5.8-0.6
                        c-2-0.3-3.9-0.7-5.9-1.3c-1.8-0.5-3.7-1-5.7-2.5c10.9,2.6,20.6,2.6,24.9,0.1c-11.7-2.4-21.3-8-27.8-18.2c-1.4-2.3-3.9-3.2-6.5-3.5
                        c-2.2-0.3-3.8,0.9-4.6,3.1c-0.6,1.7-0.5,3.4-0.1,5.1c0.4,1.6,0,2.6-1.7,3.1c-4.4,1.3-6.1,4.7-6.4,8.9c-0.5,7.1,4,12.7,11.5,14
                        C289.2,278.7,298.9,276.9,306.7,268.8z M294.6,280.5c-3.9,0.6-7.6,1.6-11.2,0.8c-5.4-1.2-8.5,1.3-11,5.4c-0.1,0.2-0.3,0.4-0.5,0.7
                        c-9.6,11.8-14.2,26-19.5,39.8c0,0.1,0.1,0.2,0.1,0.3c0.2-0.1,0.5-0.1,0.7-0.2c13.5-7.5,26.1-16.5,37.5-26.9c1-0.9,1.4-1.8,0.9-3.1
                        c-0.6-1.8-0.5-3.6-0.4-5.4C291.3,287.9,292.6,284.2,294.6,280.5z M283.1,205.7c-16.4-8.7-33.7-14.4-52.1-17.8c0.3,0.6,0.4,0.9,0.6,1
                        c5.8,7,11.6,14.1,17.6,21c7.8,9,18.6,12,30,14.2C278.9,217.5,280.3,211.5,283.1,205.7z M382.1,406c4.9-7.2,9.2-14.7,12.2-22.9
                        c3.7-9.9,4.2-19.9,1.3-30.1c-3.8-13.3-11.1-24.7-18.5-36.2c-0.6-0.9-1.3-1.3-2.4-0.8c0.8,1.9,1.5,3.9,2.2,5.8
                        c4.7,12.1,7.4,24.6,6.5,37.7c-0.8,11.8-1.4,23.7-2,35.5C381.2,398.7,381.6,402.3,382.1,406z M320.8,195.9c-0.3-0.7-0.5-1.2-0.7-1.7
                        c-4.4-10.7-7.9-21.6-8.2-33.3c-0.3-8.9,0.5-17.7,1.1-26.5c0.6-8.7,1.4-17.5,0.8-26.2c-0.1-0.8,0.3-1.8-0.7-2.5
                        c-4.9,7.7-9.3,15.4-12.3,23.9c-3.6,10-3.8,20.2-0.7,30.4c3.9,12.8,11,24,18.2,35.1C318.8,195.8,319.6,196.1,320.8,195.9z
                        M459.5,320.5c-7-8.2-13.1-16.4-20.2-23.8c-4.8-5.1-10.9-8.5-17.6-10.7c-3-1-6.1-1.8-9.6-2c2.4,7.6,1.2,13.5-7.1,16.5
                        C419.7,309,445.4,318.5,459.5,320.5z M324.1,313.4c-0.2,0.3-0.3,0.4-0.4,0.6c-0.1,0.3-0.2,0.7-0.3,1.1c-1.8,8.2-1.4,16.3,1.3,24.3
                        c3.6,10.3,4.7,20.9,3.2,31.8c-0.2,1.4-0.8,2.8-0.5,4.2c0.7,0,1-0.5,1.3-0.9c4.5-5.5,7.9-11.5,10.2-18.3c4.9-14.1,2.5-28-1-42
                        c-2.4,0.3-4.7,0.8-7.1,0.7C328.6,314.6,326.4,313.8,324.1,313.4z M313.7,306.2c-1.3,2.4-2.1,4.9-2.9,7.3
                        c-4.7,13.2-5.6,26.5-0.6,39.9c2.5,6.9,5.8,13.4,9.5,19.7c0.9,1.4,1.5,3,2.7,4.3c0.7-0.5,0.7-1.2,0.8-1.8c2.7-11.4,2-22.6-1.7-33.7
                        c-1.4-4.2-2.4-8.4-2.9-12.8c-0.6-6,0.2-11.8,1.6-17.6C318,309.7,316,308.1,313.7,306.2z M369.4,127.7c-16.3,15.4-18.9,37.1-12.6,54
                        c5.1-2.2,10.4-3.3,15.9-1.4c1.3-6.6,1.7-12.9-0.5-19C368.2,150.6,366.5,139.7,369.4,127.7z M374.2,127.5c-0.2,0.1-0.4,0.1-0.6,0.2
                        c-0.2,0.9-0.5,1.7-0.7,2.6c-2.2,9.5-1,18.7,2.3,27.7c2.3,6.4,3.1,13,1.9,19.6c-0.6,3.3-0.6,6,2,8.6c1.9,2,2.5,4.9,3.6,7.9
                        c1.9-3.6,3.1-6.9,4.2-10.2c3.5-10.4,4-20.8,0.4-31.4c-2.3-6.8-5.6-13-9.3-19.1C376.7,131.4,375.4,129.4,374.2,127.5z M395,301.3
                        c-0.1,3.3-1.1,6.3-3,9c18.6,12.5,38.8,16.7,60.6,13.6c-3.3-1.1-6.6-2-9.9-2.9c-15.2-4.4-29.3-11.1-43.2-18.5
                        C398.2,301.8,396.9,300.9,395,301.3z M322.8,190c1-0.7,1-1.7,1.6-2.4c2.1-2.2,1.9-4.9,1.6-7.7c-0.6-5.3-0.9-10.5-1.3-15.8
                        c-1.5-17.6-2.9-35.3-4.4-52.9c-0.1-1.7-1-2.7-2.4-3.4c0,3,0,5.8,0,8.6c-0.2,11.6-1.4,23.1-2,34.7C315.1,164.6,317.6,177.4,322.8,190
                        z M440.5,177.1c-12.7,6-37.5,24.4-39.2,28.8c13.1-4.7,16.3-3.7,22.2,6.4c2.3-2.2,4.1-4.6,5.4-7.4C433.1,196,436.5,186.7,440.5,177.1
                        z M293,193.9c-10.8-9.8-41.4-14.7-56.1-9.1c17,3.7,33,9.3,48.3,17.3C287.5,198.9,290,196.1,293,193.9z M371.5,320.2
                        c0.1,1.5,0.2,2.9,0.2,4.3c0.9,24.9,1.9,49.8,2.7,74.7c0.1,2.3,1.2,3.6,3,4.9c0-2,0-3.8,0-5.6c-0.1-11.3,1-22.6,1.9-33.9
                        c1.2-15-1-29.3-6.8-43.1C372.3,321,372.3,320.4,371.5,320.2z M294,302.7c-5.5,5-11.1,9.6-16.9,14c-5.8,4.3-11.9,8.1-17.9,12.1
                        c15.5,0,41.3-12.6,46.1-22.2C299.1,306.5,297.9,306.1,294,302.7z M399.3,201.5c5.5-5,11-9.6,16.8-13.9c5.7-4.2,11.7-7.9,17.6-11.8
                        c-20.6,2.3-38.9,11.2-47.9,23.9C390.7,197.5,395.2,196.6,399.3,201.5z M381.5,316.3c4.7,7.1,9,14.4,13.1,22c0.3-1.6,0.2-3.1,0.3-4.6
                        c0-1-0.1-1.9-0.8-2.8c-3.7-4.4-7-9.1-9.8-14.1C383.6,315.6,382.8,315.2,381.5,316.3z M402,321c-4.1-2.3-8.3-4.6-12.1-7.4
                        c-1-0.7-1.7-0.4-2.3,0.6c0.3,0.6,0.7,1.2,1,1.9c1,2.2,2.5,3.3,5,3.3C396.4,319.5,399.2,320.3,402,321z"
                        />
                      </svg>
                    </a>
                  </Link>
                </div>

                {/* dropdown menus */}
                <div className="hidden lg:block">
                  {navigation.tabs.map((tab) => (
                    <Menu
                      key={tab.id}
                      as="div"
                      className=" relative ml-12 inline-block"
                    >
                      <div>
                        <Menu.Button className="inline-flex w-full  px-4 py-2 bg-white text-sm font-medium text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                          {tab.name}
                          {/* <ChevronDownIcon className="-mr-1 ml-2 h-5 w-3" aria-hidden="true" />*/}
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right items-center flex-col absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                          <div className="px-1 py-1 ">
                            {tab.items.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <Link href={item.href}>
                                    <a
                                      className={`
                                      ${
                                        active
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-700"
                                      }
                                      " group text-center flex w-full px-4 py-2 text-sm"`}
                                    >
                                      {item.name}
                                    </a>
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ))}
                </div>
                <div className="ml-auto flex items-center">
                  {desktop_menu}
                  {/* Search */}
                  <div className="flex lg:ml-6">
                    <a
                      href="#"
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Tìm</span>
                      <SearchIcon className="w-6 h-6" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </div>
    </div>
  );
};

export default Header;
