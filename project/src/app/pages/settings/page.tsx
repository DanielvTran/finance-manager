"use client";

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "../../../../lib/validationSchema";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@/contexts/UserContext";
import { IUserSettingsForm } from "../../../../lib/types";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTrash } from "@fortawesome/free-solid-svg-icons";

// Components
import Nav from "@/components/Nav";

export default function Settings() {
  const router = useRouter();
  const { user, fetchUser } = useUser();
  const [isEditable, setIsEditable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletePrompt] = useState(user?.email);
  const [deleteUserInput, setDeleteUserInput] = useState("");

  // Fetch user data on mount
  useEffect(() => {
    fetchUser();
  }, []);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IUserSettingsForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName ?? undefined,
      lastName: user?.lastName ?? undefined,
      email: user?.email ?? undefined,
      password: user?.email ?? undefined,
    },
  });

  const handleEditClick = () => {
    setIsEditable((prev) => !prev);
  };

  const handleDeleteClick = async () => {
    if (deleteUserInput === deletePrompt) {
      const response = await axios.delete("/api/user/delete-user");

      if (response.status === 200) {
        router.push("/");
      }
    } else {
      alert(`Not Same: deleteUserInput:${deleteUserInput} deletePrompt:${deletePrompt}`);
    }
  };

  const onSubmit: SubmitHandler<IUserSettingsForm> = async (data) => {
    try {
      const response = await axios.post("/api/user/update-user", data);
      console.log("Update successful:", response.data);
      setIsEditable(false);
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage("Incorrect credentials");
    }
  };

  return (
    <div className="welcome-container bg-base-200 min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      <Nav />

      <div className="right-container w-full lg:w-4/5 bg-[#F2F2F2] flex min-h-screen py-20 px-20">
        <div className="max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-2xl 3xl:max-w-3xl">
          <h1 className="text-[#323E42] font-bold text-3xl lg:text-4xl text-left mb-10">Profile</h1>
          <div className="reports-container ">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-[#F2F2F2] space-y-4 rounded-lg mb-5">
              {/* First Name Input */}
              <div
                className={`flex w-fit items-center bg-[#ffffff] rounded-xl border transition-all duration-200 ${
                  errors.firstName
                    ? "border-[#E57373] border-2"
                    : isEditable
                    ? "border-[#E5B973] border-[2px]"
                    : "border-gray-300"
                } `}
              >
                <input
                  {...register("firstName")}
                  readOnly={!isEditable}
                  placeholder={errors.firstName ? errors.firstName.message : "First Name"}
                  type="text"
                  className={`w-fit pl-5 py-5 rounded-xl pr-2 bg-[#ffffff] font-bold text-[#3A6F66] focus:outline-none ${
                    errors.firstName ? "placeholder:font-bold placeholder:text-[#E57373]" : "placeholder:text-[#D9D9D9]"
                  } ${isEditable ? "border-none" : "cursor-not-allowed"}`}
                />
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className={`pr-5 text-xl cursor-pointer transition-colors ${
                    isEditable ? "text-[#E5B973]" : "text-[#D9D9D9]"
                  }`}
                  onClick={handleEditClick}
                />
              </div>

              {/* Last Name Input */}
              <div
                className={`flex w-fit items-center bg-[#ffffff] rounded-xl border transition-all duration-200 ${
                  errors.lastName
                    ? "border-[#E57373] border-2"
                    : isEditable
                    ? "border-[#E5B973] border-[2px]"
                    : "border-gray-300"
                } `}
              >
                <input
                  {...register("lastName")}
                  readOnly={!isEditable}
                  placeholder={errors.lastName ? errors.lastName.message : "Last Name"}
                  type="text"
                  className={`w-fit pl-5 py-5 rounded-xl pr-2 bg-[#ffffff] font-bold text-[#3A6F66] focus:outline-none ${
                    errors.lastName ? "placeholder:font-bold placeholder:text-[#E57373]" : "placeholder:text-[#D9D9D9]"
                  } ${isEditable ? "border-none" : "cursor-not-allowed"}`}
                />
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className={`pr-5 text-xl cursor-pointer transition-colors ${
                    isEditable ? "text-[#E5B973]" : "text-[#D9D9D9]"
                  }`}
                  onClick={handleEditClick}
                />
              </div>

              {/* Email Input */}
              <div
                className={`flex w-fit items-center bg-[#ffffff] rounded-xl border transition-all duration-200 ${
                  errors.email
                    ? "border-[#E57373] border-2"
                    : isEditable
                    ? "border-[#E5B973] border-[2px]"
                    : "border-gray-300"
                } `}
              >
                <input
                  {...register("email")}
                  readOnly={!isEditable}
                  placeholder={errors.email ? errors.email.message : "Email"}
                  type="text"
                  className={`w-fit pl-5 py-5 rounded-xl pr-2 bg-[#ffffff] font-bold text-[#3A6F66] focus:outline-none ${
                    errors.email ? "placeholder:font-bold placeholder:text-[#E57373]" : "placeholder:text-[#D9D9D9]"
                  } ${isEditable ? "border-none" : "cursor-not-allowed"}`}
                />
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className={`pr-5 text-xl cursor-pointer transition-colors ${
                    isEditable ? "text-[#E5B973]" : "text-[#D9D9D9]"
                  }`}
                  onClick={handleEditClick}
                />
              </div>

              {/* Password Input */}
              <div
                className={`flex w-fit items-center bg-[#ffffff] rounded-xl border transition-all duration-200 ${
                  errors.password
                    ? "border-[#E57373] border-2"
                    : isEditable
                    ? "border-[#E5B973] border-[2px]"
                    : "border-gray-300"
                } `}
              >
                <input
                  {...register("password")}
                  readOnly={!isEditable}
                  placeholder="Enter new password"
                  type="password"
                  className={`w-fit pl-5 py-5 rounded-xl pr-2 bg-[#ffffff] font-bold text-[#3A6F66] focus:outline-none ${
                    errors.password ? "placeholder:font-bold placeholder:text-[#E57373]" : "placeholder:text-[#D9D9D9]"
                  } ${isEditable ? "border-none" : "cursor-not-allowed"}`}
                />

                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className={`pr-5 text-xl cursor-pointer transition-colors ${
                    isEditable ? "text-[#E5B973]" : "text-[#D9D9D9]"
                  }`}
                  onClick={handleEditClick}
                />
              </div>

              <div className="setting-buttons flex w-full justify-between items-center">
                <button
                  type="submit"
                  className="text-lg md:text-2xl py-2 md:py-3 bg-[#323E42] text-[#98FF98] border-2 border-[#98FF98] rounded-xl w-3/5 text-center font-bold transition-transform transform hover:scale-105 hover:bg-[#3A494D] hover:text-[#B2FFB2] duration-300 ease-in-out"
                >
                  Update
                </button>
                <FontAwesomeIcon
                  icon={faTrash}
                  className="hover:animate-tilt pr-5 text-xl cursor-pointer text-[#D9D9D9] hover:text-[#FF5A5F] transition-colors duration-300"
                  onClick={() => {
                    const modal = document.getElementById("delete_settings_modal") as HTMLDialogElement | null;
                    if (modal) {
                      modal.showModal();
                    }
                  }}
                />
              </div>

              <dialog id="delete_settings_modal" className="modal font-bold rounded-lg">
                <div className="modal-box shadow-lg">
                  <button
                    type="button"
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-[#3A6F66] hover:bg-[#3A494D] hover:text-[#F2F2F2]"
                    onClick={() => {
                      const modal = document.getElementById("delete_settings_modal") as HTMLDialogElement | null;
                      if (modal) {
                        modal.close();
                      }
                    }}
                  >
                    ✕
                  </button>
                  <p className="py-4 text-[#ffffff] text-lg">
                    Please enter this text to delete your account
                    <span className="text-[#E57373] font-semibold">&apos;{deletePrompt}&apos;</span>
                  </p>
                  <input
                    type="text"
                    placeholder="Type the exact text here"
                    value={deleteUserInput}
                    onChange={(e) => {
                      setDeleteUserInput(e.target.value);
                    }}
                    className="input input-bordered w-full mt-2 border-[#D9D9D9] focus:border-[#98FF98] text-[#ffffff] placeholder:text-[#ffffff]"
                  />
                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn btn-error bg-[#FF5A5F] text-white font-bold hover:bg-[#FF3333]"
                      onClick={handleDeleteClick}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </dialog>
            </form>

            {errorMessage && (
              <p className="bg-[#F2F2F2] text-center font-bold rounded-xl py-3 text-[#E57373] border-2 border-[#E57373]">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
