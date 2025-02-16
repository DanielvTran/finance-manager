"use client";

import { useCategory } from "@/contexts/CategoriesContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { ICategoriesForm } from "../../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "../../lib/validationSchema";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

interface CategoryProps {
  id: number;
  title: string;
}

export default function CategoryContainer({ id, title }: CategoryProps) {
  const { categories, deleteCategory, updateCategory } = useCategory();

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

  const handleEditClick = () => {
    const modal = document.getElementById("update_categories_modal") as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await deleteCategory(id);
      console.log("Deleted category successfully:", response);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const onSubmitUpdate: SubmitHandler<ICategoriesForm> = async (data) => {
    try {
      setValue("name", getValues("name"));

      const response = await updateCategory(id, data);
      console.log("Categories after update:", categories);

      reset({
        name: "",
      });

      const modal = document.getElementById("update_categories_modal") as HTMLDialogElement | null;
      if (modal) {
        modal.close();
      }
      console.log("Updated category successfully:", response);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div
      className={`category-container bg-white p-6 rounded-lg shadow-lg items-center transition-all duration-300 border border-transparent group`}
    >
      <div className="actions flex flex-row justify-between mb-5">
        {/* Edit Icon */}
        <FontAwesomeIcon
          icon={faEllipsis}
          className="cursor-pointer transition-colors hover:text-[#E5B973]"
          onMouseEnter={(e) => {
            e.currentTarget.closest(".category-container")?.classList.add("hover-edit");
          }}
          onMouseLeave={(e) => {
            e.currentTarget.closest(".category-container")?.classList.remove("hover-edit");
          }}
          onClick={handleEditClick}
        />
        {/* Trash/Delete Icon */}
        <FontAwesomeIcon
          icon={faTrash}
          className="cursor-pointer transition-colors hover:text-[#E57373] hover:animate-tilt"
          onMouseEnter={(e) => {
            e.currentTarget.closest(".category-container")?.classList.add("hover-delete");
          }}
          onMouseLeave={(e) => {
            e.currentTarget.closest(".category-container")?.classList.remove("hover-delete");
          }}
          onClick={handleDeleteClick}
        />
      </div>
      <div className="content-container text-[#323E42] text-center mb-5 transition-transform duration-300 ease-in-out group-hover:scale-110">
        <h1 className="title font-bold text-2xl mb-2">{title}</h1>
      </div>

      <dialog id="update_categories_modal" className="modal">
        <div className="modal-box w-[30%] h-[70%] bg-white px-6">
          <div className="modal-header flex flex-row justify-between items-center mt-5">
            <h3 className="font-bold text-4xl text-[#323E42] items-center justify-between">Categories</h3>
            <FontAwesomeIcon
              icon={faXmark}
              className="text-2xl hover:cursor-pointer hover:text-[#E57373] transition-colors ease-in-out duration-300"
              onClick={() => {
                const modal = document.getElementById("update_categories_modal") as HTMLDialogElement | null;
                if (modal) {
                  modal.close();
                }
              }}
            />
          </div>

          <div className="modal-action">
            <form
              method="dialog"
              onSubmit={handleSubmit(onSubmitUpdate)}
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
                Update
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Dynamic Border Styling */}
      <style jsx>{`
        .category-container.hover-edit {
          border-color: #e5b973 !important;
        }
        .category-container.hover-delete {
          border-color: #e57373 !important;
        }
      `}</style>
    </div>
  );
}
