"use client";

import { useState } from "react";
import { useCategory } from "@/contexts/CategoriesContext";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrash } from "@fortawesome/free-solid-svg-icons";

interface CategoryProps {
  id: number;
  title: string;
  description: string;
}

export default function Category({ id, title, description }: CategoryProps) {
  const { deleteCategory } = useCategory();

  const [isEditable, setIsEditable] = useState(false);
  const [isRemovable, setIsRemovable] = useState(false);

  const handleEditClick = () => {
    setIsEditable((prev) => !prev);
    setIsRemovable(false); // Ensure only one state is active
  };

  const handleDeleteClick = async () => {
    setIsRemovable((prev) => !prev);
    setIsEditable(false); // Ensure only one state is active

    try {
      const response = await deleteCategory(id);
      console.log("Deleted category successfully:", response);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div
      className={`category-container bg-white p-6 rounded-lg shadow-lg items-center transition-all duration-300 ${
        isRemovable
          ? "border-2 border-[#E57373]"
          : isEditable
          ? "border-2 border-[#E5B973]"
          : "border border-transparent"
      }`}
    >
      <div className="actions flex flex-row justify-between mb-5">
        <FontAwesomeIcon
          icon={faEllipsis}
          className={`cursor-pointer transition-colors hover:text-[#E5B973] ${
            isEditable ? "text-[#E5B973]" : "text-[#323E42]"
          }`}
          onClick={handleEditClick}
        />
        <FontAwesomeIcon
          icon={faTrash}
          className={`cursor-pointer transition-colors hover:text-[#E57373] ${
            isRemovable ? "text-[#E57373]" : "text-[#323E42]"
          }`}
          onClick={handleDeleteClick}
        />
      </div>
      <div className="content-container text-[#323E42] text-center mb-5">
        <h1 className="title font-bold text-2xl mb-2">{title}</h1>
        <h2 className="description text-xl">{description}</h2>
      </div>
    </div>
  );
}
