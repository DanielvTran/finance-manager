"use client";

import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "../../../../lib/validationSchema";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IUserLoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IUserLoginForm>({
    resolver: zodResolver(loginUserSchema),
  });

  const onSubmit: SubmitHandler<IUserLoginForm> = async (data) => {
    try {
      const response = await axios.post("/api/auth/login", data);
      console.log("Login successful:", response.data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Incorrect credentials");
    }
  };

  return (
    <div className="welcome-container bg-base-200 min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      <div className="right-container w-full lg:w-3/5 bg-[#F2F2F2] flex items-center justify-center min-h-screen">
        <div className="hover:animate-hovertilt max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl 3xl:max-w-2xl">
          <Image src="/images/logo.png" alt="Logo" width={300} height={300} className="w-full h-auto" />
        </div>
      </div>
      <div className="left-container w-full lg:w-2/5 bg-[#323E42] flex items-center justify-center min-h-screen">
        <div className="left-content p-6 md:p-10 lg:p-12">
          <h1 className="heading text-[#98FF98] font-bold text-4xl lg:text-5xl mb-4 lg:mb-10">LOGIN</h1>
          <p>joshwong@gmail.com</p>
          <p>danieltran@gmail.com</p>
          <p> jacksib@gmail.com</p>
          <p> kim@gmail.com</p>
          <p>c3aRc?H4CQ9Yxq#T</p>
          <p>fjdkslF(9</p>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-[#323E42] space-y-4 rounded-lg mb-5">
            <input
              {...register("email")}
              placeholder={errors.email ? errors.email.message : "Email"}
              className={`w-full px-5 py-5 rounded-xl bg-[#DFFFE2] font-bold text-[#3A6F66] border ${
                errors.email
                  ? "border-[#E57373] border-2 placeholder:font-bold placeholder:text-[#E57373]"
                  : "border-gray-300 placeholder:text-[#3A6F66]"
              } focus:outline-none focus:border-[#98FF98] focus:ring-2 focus:ring-[#98FF98] hover:border-[#98FF98] hover:shadow-sm transition-all duration-200`}
            />

            <input
              {...register("password")}
              placeholder={errors.password ? errors.password.message : "Password"}
              type="password"
              className={`w-full px-5 py-5 rounded-xl bg-[#DFFFE2] font-bold text-[#3A6F66] border ${
                errors.password
                  ? "border-[#E57373] border-2 placeholder:font-bold placeholder:text-[#E57373]"
                  : "border-gray-300 placeholder:text-[#3A6F66]"
              } focus:outline-none focus:border-[#98FF98] focus:ring-2 focus:ring-[#98FF98] hover:border-[#98FF98] hover:shadow-sm transition-all duration-200`}
            />

            <button
              type="submit"
              className="text-lg md:text-2xl mb-4 py-2 md:py-3 bg-[#323E42] text-[#98FF98] border-2 border-[#98FF98] rounded-xl w-full block text-center font-bold transition-transform transform hover:scale-105 hover:bg-[#3A494D] hover:text-[#B2FFB2] duration-300 ease-in-out"
            >
              LOGIN
            </button>
          </form>
          <p className="text-sm md:text-base text-[#F2F2F2] mb-5">
            New to MintyPlan?{" "}
            <a href="/auth/signup" className="text-[#F2F2F2] hover:text-[#98FF98] underline">
              Create account
            </a>
          </p>
          {errorMessage ? (
            <p className="bg-[#F2F2F2] text-center font-bold rounded-xl py-3 text-[#E57373] border-2 border-[#E57373]">
              {errorMessage}
            </p>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
