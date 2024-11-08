"use client";

import { links } from "../../../../lib";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Budgeting() {
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
                    ? "text-[#98FF98] border-r-4 border-[#98FF98] pr-2" // Active styles
                    : "text-[#DFFFE2] hover:text-[#98FF98]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="right-container w-full lg:w-4/5 bg-[#F2F2F2] flex min-h-screen py-20 px-20">
        <div className="max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-2xl 3xl:max-w-3xl">
          <h1 className="text-[#323E42] font-bold text-3xl lg:text-4xl text-left mb-10">Settings</h1>
          <div className="reports-container grid grid-cols-3 grid-rows-2 gap-4">Content</div>
        </div>
      </div>
    </div>
  );
}
