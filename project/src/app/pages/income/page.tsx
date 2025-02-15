"use client";

import { useIncome } from "@/contexts/IncomeContext";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomeSchema } from "../../../../lib/validationSchema";
import { IIncomesForm } from "../../../../lib/types";
import { useCategory } from "@/contexts/CategoriesContext";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// Types
import { TransactionType, Category } from "@prisma/client";

// Components
import Nav from "@/components/Nav";
import IncomeContainer from "@/components/IncomeContainer";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faXmark, faChevronUp, faChevronDown, faRobot } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

interface Income {
  id: number;
  name: string;
  amount: number;
  date: Date;
  type: TransactionType;
  categoryId: number;
  category: Category;
}

export default function Income() {
  const { incomes, sortOrder, setSortOrder, fetchIncomes, addIncome } = useIncome();
  const { categories, fetchCategories } = useCategory();

  const [currentMonthIncomes, setCurrentMonthIncomes] = useState<Income[]>([]);
  const [olderIncomes, setOlderIncomes] = useState<Income[]>([]);

  const [isPastIncomesVisible, setIsPastIncomesVisible] = useState(false);

  useEffect(() => {
    fetchIncomes();
    fetchCategories();
  }, []);

  useEffect(() => {
    applySorting();
  }, [incomes, sortOrder]);

  useEffect(() => {
    if (!incomes) return;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const currentMonthIncomes = incomes.filter((income) => {
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
    });

    const olderIncomes = incomes.filter((income) => {
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() !== currentMonth || incomeDate.getFullYear() !== currentYear;
    });

    setCurrentMonthIncomes(currentMonthIncomes);
    setOlderIncomes(olderIncomes);
  }, [incomes]);

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
    if (!currentMonthIncomes || !olderIncomes) return;

    const sortedCurrentMonth = [...currentMonthIncomes];
    const sortedOlder = [...olderIncomes];

    if (sortOrder === "asc") {
      sortedCurrentMonth.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      sortedOlder.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortOrder === "desc") {
      sortedCurrentMonth.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      sortedOlder.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    setCurrentMonthIncomes(sortedCurrentMonth);
    setOlderIncomes(sortedOlder);
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
                <option value="asc">Oldest to Newest</option>
                <option value="desc">Newest to Oldest</option>
              </select>
            </div>
          </div>

          {/* Current Month Incomes Section */}
          <div className="income-section">
            <h2 className="heading flex flex-col font-bold text-xl my-5">Current Month Incomes</h2>
            <div className="income-list max-h-[300px] overflow-y-auto flex flex-col gap-4">
              {currentMonthIncomes.length > 0 ? (
                currentMonthIncomes.map((income) => (
                  <IncomeContainer
                    key={income.id}
                    id={income.id}
                    name={income.name}
                    date={income.date}
                    amount={income.amount}
                    category={income.category?.name || "Uncategorised"}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full mt-20">
                  <FontAwesomeIcon icon={faRobot} className="text-4xl mb-4" />
                  <p>No income records for this month</p>
                </div>
              )}
            </div>
          </div>

          {/* Older Incomes Section */}
          <div className="income-section">
            <div className="flex items-center cursor-pointer" onClick={() => setIsPastIncomesVisible((prev) => !prev)}>
              <h2 className="heading flex flex-col font-bold text-xl my-5">Past Incomes</h2>
              <FontAwesomeIcon icon={isPastIncomesVisible ? faChevronUp : faChevronDown} className="ml-2 text-lg" />
            </div>

            {/* Scrollable Container */}
            {isPastIncomesVisible && (
              <div className="income-list max-h-[300px] overflow-y-auto flex flex-col gap-4 transition-all duration-300">
                {olderIncomes.length > 0 ? (
                  olderIncomes.map((income) => (
                    <IncomeContainer
                      key={income.id}
                      id={income.id}
                      name={income.name}
                      date={income.date}
                      amount={income.amount}
                      category={income.category?.name || "Uncategorised"}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full mt-20">
                    <FontAwesomeIcon icon={faRobot} className="text-4xl mb-4" />
                    <p>No past income records available</p>
                  </div>
                )}
              </div>
            )}
          </div>
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
                <option value="" disabled>
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
