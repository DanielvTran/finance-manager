"use client";

import { useCategory } from "@/contexts/CategoriesContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "../../../../lib/validationSchema";
import { ICategoriesForm } from "../../../../lib/types";

// Components
import Nav from "@/components/Nav";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faXmark, faRobot } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import CategoryContainer from "@/components/CategoryContainer";

export default function Categories() {
  const { categories, sortOrder, setSortOrder, fetchCategories, addCategory, updateCategory } = useCategory();
  const [sortedCategories, setSortedCategories] = useState(categories || []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    applySorting();
  }, [categories, sortOrder]);

  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ICategoriesForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  const applySorting = () => {
    if (!categories) return;

    const sorted = [...categories];
    if (sortOrder === "asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    setSortedCategories(sorted);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const onSubmitAdd: SubmitHandler<ICategoriesForm> = async (data) => {
    try {
      setValue("name", getValues("name"));

      const response = await addCategory(data);
      console.log("Categories after add:", categories);

      reset({
        name: "",
      });

      const modal = document.getElementById("add_categories_modal") as HTMLDialogElement | null;
      if (modal) {
        modal.close();
      }
      console.log("Created category successfully:", response);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="welcome-container bg-base-200 min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      <Nav />

      <div className="right-container text-[#323E42] w-full lg:w-4/5 bg-[#F2F2F2] flex flex-col min-h-screen py-20 px-20">
        <h1 className=" font-bold text-3xl lg:text-4xl text-left mb-10">Personalise your categories!</h1>
        <div className="categories-container">
          <div className="header flex flex-row justify-between mb-10">
            <h1 className="heading lg:text-2xl font-bold">Categories</h1>
            <div className="header-actions flex flex-row gap-5 items-center">
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="text-xl hover:cursor-pointer hover:text-[#587d7b] transition-colors ease-in-out duration-150"
                onClick={() => {
                  const modal = document.getElementById("add_categories_modal") as HTMLDialogElement | null;
                  if (modal) {
                    modal.showModal();
                  }
                }}
              />

              <select className="sort bg-white rounded p-1" value={sortOrder} onChange={handleSortChange}>
                <option value="" disabled selected>
                  Sort
                </option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          {sortedCategories && sortedCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto">
              {sortedCategories.map((item) => (
                <CategoryContainer key={item.id} id={item.id} title={item.name} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full mt-20">
              <FontAwesomeIcon icon={faRobot} className="text-4xl mb-4" />
              <p>No categories available</p>
            </div>
          )}
        </div>
      </div>

      <dialog id="add_categories_modal" className="modal">
        <div className="modal-box w-[30%] h-[70%] bg-white px-6">
          <div className="modal-header flex flex-row justify-between items-center mt-5">
            <h3 className="font-bold text-4xl text-[#323E42] items-center justify-between">Categories</h3>
            <FontAwesomeIcon
              icon={faXmark}
              className="text-2xl hover:cursor-pointer hover:text-[#E57373] transition-colors ease-in-out duration-300"
              onClick={() => {
                const modal = document.getElementById("add_categories_modal") as HTMLDialogElement | null;
                if (modal) {
                  modal.close();
                }
              }}
            />
          </div>

          <div className="modal-action">
            <form
              method="dialog"
              onSubmit={handleSubmit(onSubmitAdd)}
              className="categories-form flex flex-col w-full gap-10 mt-5"
            >
              {/* Name Input */}
              <input
                {...register("name")}
                placeholder={errors.name ? errors.name.message : "Name"}
                type="text"
                className={`w-full border-2 border-[#D9D9D9] py-5 px-4 rounded-xl bg-[#ffffff] font-bold text-[#323E42] focus:outline-none focus:border-[#323E42] ${
                  errors.name ? "placeholder:font-bold placeholder:text-[#E57373]" : "placeholder:text-[#D9D9D9]"
                }`}
              />

              <button
                type="submit"
                className="mt-10 w-full py-5 items-center justify-center text-[#98FF98] font-bold text-2xl border-2 border-[#98FF98] bg-[#323E42] rounded-xl transition-all duration-300 hover:border-4 hover:border-[#B2FFB2]"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
