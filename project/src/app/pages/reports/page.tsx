"use client";

// Components
import Nav from "@/components/Nav";

export default function Budgeting() {
  return (
    <div className="welcome-container bg-base-200 min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      <Nav />

      <div className="right-container w-full lg:w-4/5 bg-[#F2F2F2] flex min-h-screen py-20 px-20">
        <div className="max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-2xl 3xl:max-w-3xl">
          <h1 className="text-[#323E42] font-bold text-3xl lg:text-4xl text-left mb-10">Reports</h1>
          <div className="reports-container grid grid-cols-3 grid-rows-2 gap-4">Content</div>
        </div>
      </div>
    </div>
  );
}
