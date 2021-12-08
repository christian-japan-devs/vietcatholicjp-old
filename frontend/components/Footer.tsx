import React from "react";
import Link from "next/link";
import { navigation } from "../domain/models/Navigation";
import { ColorSet } from '../domain/models/ColorSet';

const Footer = () => {
  return (
    <footer className="footer bg-white relative pt-1 border-t border-gray-200">
      <div className="hidden lg:block container mx-auto px-6">
        <h4 className={`${ColorSet.TEXT_HEADING} mt-6 text-center sm:text-3xl text-2xl`} >
            Giáo đoàn công giáo Việt Nam tại Nhật Bản
        </h4>
        <div className="sm:flex sm:mt-8">
          <div className="mt-8 sm:mt-0 sm:w-full lg:px-36 md:mx-24 flex flex-col md:flex-row justify-between">
          {navigation.tabs.map((tab) => (
            <div key={tab.name} className="flex flex-col">
              <span className="font-bold text-gray-700 uppercase mb-2">
                {tab.name}
              </span>
              {tab.items.map((item)=>(
                  <span key={item.name} className="my-2">
                    <Link href={item.href} >
                        <a className="text-gray-600  text-md hover:text-blue-400" >{item.name}</a>
                    </Link>
                </span>
              ))}
            </div>
            
          ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6">
        <div className="mt-16 border-t border-gray-200 flex flex-col items-center">
          <div className="sm:w-2/3 text-center py-6">
            <p className="text-sm text-indigo-700 font-bold mb-2">
              © {new Date().getFullYear()} <a color="inherit" target="_blank" rel="noreferrer" href="https://github.com/christian-japan-devs/">
                Christian Japan Devs
            </a>{' '}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
