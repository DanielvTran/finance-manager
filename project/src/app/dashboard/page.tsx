"use client";

import { useUser } from "@/contexts/UserContext";
import Graph from "@/components/Graph";
import { useEffect } from "react";

// Components
import Nav from "@/components/Nav";

export default function Dashboard() {
  const { user, fetchUser } = useUser();

  // Fetch user data on mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="welcome-container bg-base-200 min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      <Nav />

      <div className="right-container w-full lg:w-4/5 bg-[#F2F2F2] flex min-h-screen py-20 px-20">
        <div className="max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-2xl 3xl:max-w-3xl">
          <div className="heading-container flex flex-row items-center justify-between">
            <h1 className="text-[#323E42] font-bold text-3xl lg:text-4xl text-left my-10">
              Welcome back, {user?.firstName}
            </h1>
            ;
          </div>

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
