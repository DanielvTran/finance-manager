"use client";

import { useUser } from "@/contexts/UserContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Graph from "@/components/Graph";
import { links } from "../../../lib";

export default function Dashboard() {
  const pathname = usePathname();

  const { user, loading, error } = useUser();

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
                    ? "text-[#98FF98] border-l-4 border-[#98FF98] pl-2"
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
          <h1 className="text-[#323E42] font-bold text-3xl lg:text-4xl text-left mb-10">
            Welcome back, {user?.firstName}
          </h1>
          <div className="reports-container grid grid-cols-3 grid-rows-2 gap-4">
            {/* Top Left - Income */}
            <div className="transaction-container col-span-2">
              <Graph title="Income" description="Graph" />
            </div>

            {/* Bottom Left - Expense */}
            <div className="transaction-container col-span-2">
              <Graph title="Expense" description="Graph" />
            </div>

            {/* Right - Budget spanning both rows */}
            <div className="budget-container col-span-1 row-span-2">
              <Graph title="Budget" description="Graph" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
