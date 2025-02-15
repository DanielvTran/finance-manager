"use client";

import { useState } from "react";
import { useCategory } from "@/contexts/CategoriesContext";
import { useBudget } from "@/contexts/BudgetContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { IBudgetForm } from "../../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema } from "../../lib/validationSchema";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

interface BudgetProps {
  id: number;
  category: string;
  amount: number;
  percentage: number;
}

export default function BudgetContainer({ id, category, amount, percentage }: BudgetProps) {
  const { categories } = useCategory();
  const { budgets, sortOrder, fetchBudgets, setSortOrder, deleteBudget, updateBudget } = useBudget();
  const [isEditable, setIsEditable] = useState(false);
  const [isRemovable, setIsRemovable] = useState(false);

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<IBudgetForm>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      amount: undefined,
      categoryId: undefined,
    },
  });

  const handleEditClick = () => {
    setIsEditable((prev) => !prev);
    setIsRemovable(false);

    const modal = document.getElementById("update_budgets_modal") as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const handleDeleteClick = async () => {
    setIsRemovable((prev) => !prev);
    setIsEditable(false);

    try {
      const response = await deleteBudget(id);
      console.log("Deleted budget successfully:", response);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const onSubmitUpdate: SubmitHandler<IBudgetForm> = async (data) => {
    try {
      const response = await updateBudget(id, data);
      console.log("Budgets after update:", budgets);

      reset({
        amount: undefined,
        categoryId: undefined,
      });

      const modal = document.getElementById("update_budgets_modal") as HTMLDialogElement | null;
      if (modal) {
        modal.close();
      }
      console.log("Updated budget successfully:", response);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div
      className={`budget-container bg-white p-6 rounded-lg shadow-lg items-center transition-all duration-300 border border-transparent group`}
    >
      <div className="actions flex flex-row justify-between mb-5">
        {/* Edit Icon */}
        <FontAwesomeIcon
          icon={faEllipsis}
          className="cursor-pointer transition-colors hover:text-[#E5B973]"
          onMouseEnter={(e) => {
            e.currentTarget.closest(".budget-container")?.classList.add("hover-edit");
          }}
          onMouseLeave={(e) => {
            e.currentTarget.closest(".budget-container")?.classList.remove("hover-edit");
          }}
          onClick={handleEditClick}
        />
        {/* Trash/Delete Icon */}
        <FontAwesomeIcon
          icon={faTrash}
          className="cursor-pointer transition-colors hover:text-[#E57373] hover:animate-tilt"
          onMouseEnter={(e) => {
            e.currentTarget.closest(".budget-container")?.classList.add("hover-delete");
          }}
          onMouseLeave={(e) => {
            e.currentTarget.closest(".budget-container")?.classList.remove("hover-delete");
          }}
          onClick={handleDeleteClick}
        />
      </div>
      <div className="content-container text-gray-800 text-center mb-5 flex justify-center">
        <div className="flex flex-col items-center gap-5">
          <h1 className="title font-bold text-2xl mb-2">{category}</h1>
          <p>${amount}</p>
          <div
            className="radial-progress text-[#323E42] transition-transform duration-300 ease-in-out group-hover:scale-110"
            style={{ "--value": `${percentage}` || 0 } as React.CSSProperties}
            role="progressbar"
            data-testid="progress-bar"
          >
            {percentage ? percentage.toFixed(0) : "0"}%
          </div>
        </div>
      </div>

      <dialog id="update_budgets_modal" className="modal">
        <div className="modal-box w-[30%] h-[70%] bg-white px-6">
          <div className="modal-header flex flex-row justify-between items-center mt-5">
            <h3 className="font-bold text-4xl text-[#323E42] items-center justify-between">Categories</h3>
            <FontAwesomeIcon
              icon={faXmark}
              className="text-2xl hover:cursor-pointer hover:text-[#E57373] transition-colors ease-in-out duration-300"
              onClick={() => {
                const modal = document.getElementById("update_budgets_modal") as HTMLDialogElement | null;
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
              {/* Amount Input */}
              <input
                {...register("amount")}
                placeholder={errors.amount ? errors.amount.message : "Amount"}
                type="text"
                className={`w-full border-2 border-[#D9D9D9] py-5 px-4 rounded-xl bg-[#ffffff] font-bold text-[#323E42] focus:outline-none focus:border-[#323E42] ${
                  errors.amount ? "placeholder:font-bold placeholder:text-[#E57373]" : "placeholder:text-[#D9D9D9]"
                }`}
              />

              {/* Category Input */}
              <select
                {...register("categoryId")}
                className={`w-full border-2 border-[#D9D9D9] py-5 px-4 rounded-xl bg-[#ffffff] font-bold text-[#323E42] focus:outline-none focus:border-[#323E42] ${
                  errors.categoryId ? "placeholder:font-bold placeholder:text-[#E57373]" : "placeholder:text-[#D9D9D9]"
                }`}
              >
                <option value="" disabled selected>
                  Select Category
                </option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

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
        .budget-container.hover-edit {
          border-color: #e5b973 !important;
        }
        .budget-container.hover-delete {
          border-color: #e57373 !important;
        }
      `}</style>
    </div>
  );
}
