import React from "react";
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from "next/dist/client/router";
import Header from "./Header";
import Footer from "./Footer";

interface Props {
    auth: boolean;
    notification:{
        open:boolean,
        message?:string,
        setOpen: (open: boolean) => void;
    }
    children?: React.ReactElement,
  }

const Layout = (props:Props) => {

    const router = useRouter();

    const logout = async () => {
        await fetch('http://localhost:8000/api/auth/logout', {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        })

        await router.push('/auth/login');
    }


    return (
        <>
        <Header auth={props.auth}/>
        <main>
            {props.notification.open?
            <div className="absolute top-32 right-2 flex max-w-sm w-full bg-white mg-b-2 shadow-md rounded-lg overflow-hidden mx-auto">
            <div className="w-2 bg-red-600"></div>
            <div className="w-full flex justify-between items-start px-2 py-2">
                <div className="flex flex-col ml-2">
                <label className="text-gray-800">Thông báo</label>
                <p className="text-gray-500 ">{props.notification.message}</p>
                </div>
                <a href="#" onClick={()=>props.notification.setOpen(false)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
                </a>
            </div>
            </div>:<></>}
            {props.children}
        </main>
        <Footer></Footer>
        </>
    );
};

export default Layout;