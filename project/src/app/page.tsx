import Image from "next/image";

export default function Home() {
  return (
    <div className="welcome-container bg-base-200 min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      <div className="left-container w-full lg:w-2/5 bg-[#323E42] flex items-center justify-center min-h-screen">
        <div className="left-content p-6 md:p-10 lg:p-12">
          <h1 className="heading text-[#98FF98] font-bold text-4xl lg:text-5xl mb-4 lg:mb-5">MintyPlan</h1>
          <h2 className="text-2xl md:text-3xl text-[#DFFFE2] mb-6 lg:mb-10">Welcome to MintyPlan</h2>
          <p className="text-md md:text-lg text-[#DFFFE2] mb-4 lg:mb-5">
            All in one application for managing your finance!
          </p>
          <a
            href="/auth/login"
            className="text-lg md:text-2xl mb-4 py-2 md:py-3 bg-[#323E42] text-[#98FF98] border-2 border-[#98FF98] rounded-xl w-full block text-center font-bold transition-transform transform hover:scale-105 hover:bg-[#3A494D] hover:text-[#B2FFB2] duration-300 ease-in-out"
          >
            LOGIN
          </a>
          <p className="text-sm md:text-base text-[#F2F2F2]">
            New to MintyPlan?{" "}
            <a href="/auth/signup" className="text-[#F2F2F2] hover:text-[#98FF98] underline">
              Create account
            </a>
          </p>
        </div>
      </div>
      <div className="right-container w-full lg:w-3/5 bg-[#F2F2F2] flex items-center justify-center min-h-screen">
        <div className="hover:animate-hovertilt max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl 3xl:max-w-2xl">
          <Image src="/images/logo.png" alt="Logo" width={300} height={300} className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
}
