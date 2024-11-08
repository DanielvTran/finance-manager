"use client";

interface GraphProps {
  title: string;
  description: string;
}

export default function Graph({ title, description }: GraphProps) {
  return (
    <div className="income-container bg-[#D9D9D9] p-5 rounded-lg">
      <h1 className="heading mb-5 text-[#323E42] font-bold text-2xl">{title}</h1>
      <div className="graph flex justify-center bg-[#ffffff] rounded-lg">{description}</div>
    </div>
  );
}
