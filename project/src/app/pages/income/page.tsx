"use client";

import { useIncome } from "@/contexts/IncomeContext";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomeSchema } from "../../../../lib/validationSchema";
import { IIncomesForm } from "../../../../lib/types";
import { useCategory } from "@/contexts/CategoriesContext";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// Components
import Nav from "@/components/Nav";
import IncomeContainer from "@/components/IncomeContainer";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faXmark, faRobot, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function Income() {
  const { incomes, sortOrder, setSortOrder, fetchIncomes, addIncome } = useIncome();
  const { categories, fetchCategories } = useCategory();

  const [sortedIncomes, setSortedIncomes] = useState(incomes || []);

  useEffect(() => {
    fetchIncomes();
    fetchCategories();
  }, []);

  console.log("Incomes:", incomes);

  useEffect(() => {
    applySorting();
  }, [incomes, sortOrder]);

  const {
    register,
    formState: { errors },
    control,
    reset,
    handleSubmit,
  } = useForm<IIncomesForm>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      name: undefined,
      amount: undefined,
      date: undefined,
      categoryId: undefined,
    },
  });

  const applySorting = () => {
    if (!incomes) return;

    const sorted = [...incomes];
    if (sortOrder === "asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    setSortedIncomes(sorted);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const onSubmitAdd: SubmitHandler<IIncomesForm> = async (data) => {
    try {
      const response = await addIncome(data);
      console.log("Incomes after add:", incomes);

      reset({
        name: undefined,
        amount: undefined,
        date: undefined,
        categoryId: undefined,
      });

      const modal = document.getElementById("add_incomes_modal") as HTMLDialogElement | null;
      if (modal) {
        modal.close();
      }
      console.log("Created income successfully:", response);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  console.log("Sorted Incomes:", sortedIncomes);

  return (
    <div className="welcome-container bg-base-200 min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      <Nav />

      <div className="right-container text-[#323E42] w-full lg:w-4/5 bg-[#F2F2F2] flex flex-col min-h-screen py-20 px-20">
        <h1 className=" font-bold text-3xl lg:text-4xl text-left mb-10">Here are your income transactions!</h1>
        <div className="incomes-container">
          <div className="header flex flex-row justify-between mb-10">
            <h1 className="heading lg:text-2xl font-bold">Income</h1>
            <div className="header-actions flex flex-row gap-5 items-center">
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="text-xl hover:cursor-pointer hover:text-[#587d7b] transition-colors ease-in-out duration-150"
                onClick={() => {
                  const modal = document.getElementById("add_incomes_modal") as HTMLDialogElement | null;
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

          {sortedIncomes && sortedIncomes.length > 0 ? (
            <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto">
              {sortedIncomes.map((item) => (
                <IncomeContainer
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  date={item.date}
                  amount={item.amount}
                  category={item.category?.name}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full mt-20">
              <FontAwesomeIcon icon={faRobot} className="text-4xl mb-4" />
              <p>No income records available</p>
            </div>
          )}
        </div>
      </div>

      <dialog id="add_incomes_modal" className="modal">
        <div className="modal-box w-[30%] h-[70%] bg-white px-6">
          <div className="modal-header flex flex-row justify-between items-center mt-5">
            <h3 className="font-bold text-4xl text-[#323E42] items-center justify-between">Incomes</h3>
            <FontAwesomeIcon
              icon={faXmark}
              className="text-2xl hover:cursor-pointer hover:text-[#E57373] transition-colors ease-in-out duration-300"
              onClick={() => {
                const modal = document.getElementById("add_incomes_modal") as HTMLDialogElement | null;
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
              className="incomes-form flex flex-col w-full gap-10 mt-5"
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
              {/* Amount Input */}
              <input
                {...register("amount")}
                placeholder={errors.amount ? errors.amount.message : "Amount"}
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
                    dateFormat="MMMM d, yyyy"
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
                Create
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
