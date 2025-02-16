"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema } from "../../lib/validationSchema";
import { format } from "date-fns";
import { useExpense } from "@/contexts/ExpenseContext";
import { IExpensesForm } from "../../lib/types";
import DatePicker from "react-datepicker";
import { useCategory } from "@/contexts/CategoriesContext";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faEllipsis, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

interface ExpenseProps {
  id: number;
  name: string;
  date: Date;
  amount: number;
  category: string;
}

export default function ExpenseContainer({ id, name, date, amount, category }: ExpenseProps) {
  const { categories } = useCategory();
  const { expenses, deleteExpense, updateExpense } = useExpense();

  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<IExpensesForm>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      name: undefined,
      amount: undefined,
      date: undefined,
      categoryId: undefined,
    },
  });

  const handleEditClick = () => {
    const modal = document.getElementById(`update_expenses_modal_${id}`) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await deleteExpense(id);
      console.log("Deleted expense successfully:", response);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const onSubmitUpdate: SubmitHandler<IExpensesForm> = async (data) => {
    try {
      const response = await updateExpense(id, data);
      console.log("Expenses after update:", expenses);

      reset({
        name: "",
      });

      const modal = document.getElementById(`update_expenses_modal_${id}`) as HTMLDialogElement | null;
      if (modal) {
        modal.close();
      }
      console.log("Updated expense successfully:", response);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div
      className={`expense-container bg-white p-6 rounded-lg shadow-lg items-center transition-all duration-300 border border-transparent group hover:scale-95`}
    >
      <div className="content-container text-[#323E42] text-center my-5 flex justify-start items-center space-x-10 w-full">
        <h1 className="name font-bold text-2xl w-1/4">{name}</h1>
        {category ? (
          <p className="category font-bold text-2xl w-1/4">{category}</p>
        ) : (
          <FontAwesomeIcon icon={faCircleQuestion} className="text-xl" />
        )}

        <p className="date font-bold text-2xl w-1/4">{format(new Date(date), "dd/MM/yyyy")}</p>
        <p className="amount font-bold text-2xl w-1/4">${amount}</p>

        {/* Edit Icon */}
        <FontAwesomeIcon
          icon={faEllipsis}
          className="cursor-pointer transition-colors hover:text-[#E5B973]"
          onMouseEnter={(e) => {
            e.currentTarget.closest(".expense-container")?.classList.add("hover-edit");
          }}
          onMouseLeave={(e) => {
            e.currentTarget.closest(".expense-container")?.classList.remove("hover-edit");
          }}
          onClick={handleEditClick}
        />
        {/* Trash/Delete Icon */}
        <FontAwesomeIcon
          icon={faTrash}
          className="cursor-pointer transition-colors hover:text-[#E57373] hover:animate-tilt"
          onMouseEnter={(e) => {
            e.currentTarget.closest(".expense-container")?.classList.add("hover-delete");
          }}
          onMouseLeave={(e) => {
            e.currentTarget.closest(".expense-container")?.classList.remove("hover-delete");
          }}
          onClick={handleDeleteClick}
        />
      </div>

      <dialog id={`update_expenses_modal_${id}`} className="modal">
        <div className="modal-box w-[30%] h-[70%] bg-white px-6">
          <div className="modal-header flex flex-row justify-between items-center mt-5">
            <FontAwesomeIcon
              icon={faXmark}
              className="text-2xl hover:cursor-pointer hover:text-[#E57373] transition-colors ease-in-out duration-300"
              onClick={() => {
                const modal = document.getElementById(`update_expenses_modal_${id}`) as HTMLDialogElement | null;
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
              className="expenses-form flex flex-col w-full gap-10 mt-5"
            >
              {/* Name Input */}
              <input
                {...register("name")}
                placeholder={errors.name ? errors.name.message : name}
                type="text"
                className={`w-full border-2 border-[#D9D9D9] py-5 px-4 rounded-xl bg-[#ffffff] font-bold text-[#323E42] focus:outline-none focus:border-[#323E42] ${
                  errors.name ? "placeholder:font-bold placeholder:text-[#E57373]" : "placeholder:text-[#D9D9D9]"
                }`}
              />
              {/* Amount Input */}
              <input
                {...register("amount")}
                placeholder={errors.amount ? errors.amount.message : amount.toString()}
                type="number"
                className={`w-full border-2 border-[#D9D9D9] py-5 px-4 rounded-xl bg-[#ffffff] font-bold text-[#323E42] focus:outline-none focus:border-[#323E42] ${
                  errors.amount ? "placeholder:font-bold placeholder:text-[#E57373]" : "placeholder:text-[#D9D9D9]"
                }`}
              />
              {/* Date Input */}
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date | null) => {
                      if (date) {
                        field.onChange(date);
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={errors.date ? errors.date.message : "Date"}
                    required
                    className={`w-full border-2 border-[#D9D9D9] py-5 px-4 rounded-xl bg-[#ffffff] font-bold text-[#323E42] focus:outline-none focus:border-[#323E42] ${
                      errors.date ? "placeholder:font-bold placeholder:text-[#E57373]" : "placeholder:text-[#D9D9D9]"
                    }`}
                  />
                )}
              />
              {/* Category Input */}
              <select
                {...register("categoryId")}
                className={`w-full border-2 border-[#D9D9D9] py-5 px-4 rounded-xl bg-[#ffffff] font-bold text-[#323E42] focus:outline-none focus:border-[#323E42] ${
                  errors.categoryId ? "placeholder:font-bold placeholder:text-[#E57373]" : "placeholder:text-[#D9D9D9]"
                }`}
              >
                <option value={category} disabled selected>
                  {category}
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
