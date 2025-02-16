"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { links } from "../../lib";
import { format } from "date-fns";

export default function Nav() {
  const pathname = usePathname();

  const { logoutUser } = useUser();

  const currentDate = new Date();

  return (
    <div className="left-container w-full lg:w-1/5 bg-[#323E42] flex justify-center min-h-screen py-10">
      <div className="left-content">
        <h1 className="heading text-[#98FF98] font-bold text-3xl lg:text-4xl mb-3 lg:mb-20">MintyPlan</h1>

        <p className="date text-[#98FF98] mb-10 text-2xl">{format(new Date(currentDate), "dd/MM/yyyy")}</p>

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

          <FontAwesomeIcon
            icon={faRightFromBracket}
            onClick={logoutUser}
            className="logout-button cursor-pointer  text-xl hover:text-[#FF5A5F] transition-colors duration-300"
          />
        </nav>
      </div>
    </div>
  );
}
