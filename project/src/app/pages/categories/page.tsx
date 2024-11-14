"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { links } from "../../../../lib";

import Category from "@/components/Category";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

const data = ["1", "2", "3", "4", "5", "6", "1", "2", "3", "4", "5", "6", "1", "2", "3", "5"];

export default function Categories() {
  const pathname = usePathname();

  return (
    <div className="welcome-container bg-base-200 min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      <div className="left-container w-full lg:w-1/5 bg-[#323E42] flex justify-center min-h-screen py-20">
        <div className="left-content">
          <h1 className="heading text-[#98FF98] font-bold text-3xl lg:text-4xl mb-3 lg:mb-20">MintyPlan</h1>

          <nav className="space-y-4 lg:space-y-8 xl:space-y-10 2xl:space-y-12 font-bold">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xl md:text-2xl lg:text-3xl block transition ${
                  pathname === link.href
                    ? "text-[#98FF98] border-r-4 border-[#98FF98] pr-2"
                    : "text-[#DFFFE2] hover:text-[#98FF98]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="right-container text-[#323E42] w-full lg:w-4/5 bg-[#F2F2F2] flex flex-col min-h-screen py-20 px-20">
        <h1 className=" font-bold text-3xl lg:text-4xl text-left mb-10">Personalise your categories!</h1>
        <div className="categories-container">
          <div className="header flex flex-row justify-between mb-10">
            <h1 className="heading lg:text-2xl font-bold">Categories</h1>
            <div className="header-actions flex flex-row gap-5 items-center">
              <FontAwesomeIcon icon={faCirclePlus} className="text-xl" />
              <select className="sort bg-white rounded p-1">
                <option value="">Sort</option>
                <option value="">Sort</option>
                <option value="">Sort</option>
              </select>
              <select className="filter bg-white rounded p-1">
                <option value="">Filter</option>
                <option value="">Filter</option>
                <option value="">Filter</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto">
            {/* TO-DO: For key prop use the id of the category from mysql */}
            {data.map((item, index) => (
              <Category key={index} title={item} description={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
