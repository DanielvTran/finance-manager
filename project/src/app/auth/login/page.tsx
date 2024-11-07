"use client";

import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";

interface IUserForm {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<IUserForm>();

  const onSubmit: SubmitHandler<IUserForm> = (data) => console.log(data);

  return (
    <div className="welcome-container bg-base-200 min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      <div className="right-container w-full lg:w-3/5 bg-[#F2F2F2] flex items-center justify-center min-h-screen">
        <div className="hover:animate-tilt max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl 3xl:max-w-2xl">
          <Image src="/images/logo.png" alt="Logo" width={300} height={300} className="w-full h-auto" />
        </div>
      </div>
      <div className="left-container w-full lg:w-2/5 bg-[#323E42] flex items-center justify-center min-h-screen">
        <div className="left-content p-6 md:p-10 lg:p-12">
          <h1 className="heading text-[#98FF98] font-bold text-4xl lg:text-5xl mb-4 lg:mb-10">LOGIN</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-[#323E42] space-y-4 rounded-lg mb-5">
            <input
              {...register("email")}
              placeholder="Email"
              className="w-full px-5 py-5 rounded-xl bg-[#DFFFE2] font-bold text-[#3A6F66] placeholder:text-[#3A6F66] border border-gray-300
             focus:outline-none focus:border-[#98FF98] focus:ring-2 focus:ring-[#98FF98] 
             hover:border-[#98FF98] hover:shadow-sm transition-all duration-200"
            />

            <input
              {...register("password")}
              placeholder="Password"
              type="password"
              className="w-full px-5 py-5 rounded-xl bg-[#DFFFE2] font-bold text-[#3A6F66] placeholder:text-[#3A6F66] border border-gray-300
              focus:outline-none focus:border-[#98FF98] focus:ring-2 focus:ring-[#98FF98] 
              hover:border-[#98FF98] hover:shadow-sm transition-all duration-200"
            />

            <button
              type="submit"
              className="text-lg md:text-2xl mb-4 py-2 md:py-3 bg-[#323E42] text-[#98FF98] border-2 border-[#98FF98] rounded-xl w-full block text-center font-bold transition-transform transform hover:scale-105 hover:bg-[#3A494D] hover:text-[#B2FFB2] duration-300 ease-in-out"
            >
              LOGIN
            </button>
          </form>

          <p className="text-sm md:text-base text-[#F2F2F2]">
            New to MintyPlan?{" "}
            <a href="/auth/signup" className="text-[#F2F2F2] hover:text-[#98FF98] underline">
              Create account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
