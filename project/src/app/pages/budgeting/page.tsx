"use client";

import { useBudget } from "@/contexts/BudgetContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema } from "../../../../lib/validationSchema";
import { IBudgetForm } from "../../../../lib/types";
import { useCategory } from "@/contexts/CategoriesContext";
import { Category } from "../../../../lib/types";

import "react-datepicker/dist/react-datepicker.css";

// Components
import Nav from "@/components/Nav";
import BudgetContainer from "@/components/BudgetContainer";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faXmark, faRobot } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function Budget() {
  const { budgets, sortOrder, setSortOrder, fetchBudgets, addBudget } = useBudget();
  const { categories, fetchCategories } = useCategory();

  const [sortedBudgets, setSortedBudgets] = useState(budgets || []);
  const [availableCategories, setAvailableCategories] = useState<Category[]>();

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  console.log("Budgets:", budgets);

  useEffect(() => {
    applySorting();
  }, [budgets, sortOrder]);

  useEffect(() => {
    if (categories && budgets) {
      const usedCategoryIds = new Set(budgets.map((budget) => budget.categoryId));
      const filteredCategories = categories.filter((category) => !usedCategoryIds.has(category.id));
      setAvailableCategories(filteredCategories);
    }
  }, [categories, budgets]);

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

  const applySorting = () => {
    if (!budgets) return;

    const sorted = [...budgets];
    if (sortOrder === "asc") {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOrder === "desc") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    setSortedBudgets(sorted);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const onSubmitAdd: SubmitHandler<IBudgetForm> = async (data) => {
    try {
      const response = await addBudget(data);
      console.log("Budgets after add:", budgets);

      reset({
        amount: undefined,
        categoryId: undefined,
      });

      const modal = document.getElementById("add_budgets_modal") as HTMLDialogElement | null;
      if (modal) {
        modal.close();
      }
      console.log("Created budget successfully:", response);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  console.log("Sorted Budgets:", sortedBudgets);

  return (
    <div className="welcome-container bg-base-200 min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      <Nav />

      <div className="right-container text-[#323E42] w-full lg:w-4/5 bg-[#F2F2F2] flex flex-col min-h-screen py-20 px-20">
        <h1 className=" font-bold text-3xl lg:text-4xl text-left mb-10">Here are your budgets!</h1>
        <div className="budgets-container">
          <div className="header flex flex-row justify-between mb-10">
            <h1 className="heading lg:text-2xl font-bold">Budgets</h1>
            <div className="header-actions flex flex-row gap-5 items-center">
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="text-xl hover:cursor-pointer hover:text-[#587d7b] transition-colors ease-in-out duration-150"
                onClick={() => {
                  const modal = document.getElementById("add_budgets_modal") as HTMLDialogElement | null;
                  if (modal) {
                    modal.showModal();
                  }
                }}
              />

              <select className="sort bg-white rounded p-1" value={sortOrder} onChange={handleSortChange}>
                <option value="" disabled selected>
                  Sort
                </option>
                <option value="asc">Oldest to Newest</option>
                <option value="desc">Newest to Oldest</option>
              </select>
            </div>
          </div>

          {sortedBudgets && sortedBudgets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto">
              {sortedBudgets.map((item) => (
                <BudgetContainer
                  key={item.id}
                  id={item.id}
                  amount={item.amount}
                  percentage={item.percentage}
                  category={item.category?.name}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full mt-20">
              <FontAwesomeIcon icon={faRobot} className="text-4xl mb-4" />
              <p>No budget records available</p>
            </div>
          )}
        </div>
      </div>

      <dialog id="add_budgets_modal" className="modal">
        <div className="modal-box w-[30%] h-[70%] bg-white px-6">
          <div className="modal-header flex flex-row justify-between items-center mt-5">
            <h3 className="font-bold text-4xl text-[#323E42] items-center justify-between">Budgets</h3>
            <FontAwesomeIcon
              icon={faXmark}
              className="text-2xl hover:cursor-pointer hover:text-[#E57373] transition-colors ease-in-out duration-300"
              onClick={() => {
                const modal = document.getElementById("add_budgets_modal") as HTMLDialogElement | null;
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
              className="budgets-form flex flex-col w-full gap-10 mt-5"
            >
              {/* Amount Input */}
              <input
                {...register("amount")}
                placeholder={errors.amount ? errors.amount.message : "Amount"}
                type="number"
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
                <option value="" disabled>
                  Select Category
                </option>
                {availableCategories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

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
