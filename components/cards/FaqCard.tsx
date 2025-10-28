"use client";

import { useState } from "react";

export default function FaqCard({ id, question, answer }: { id: number; question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative flex flex-col bg-neutral rounded-xl shadow-md cursor-pointer p-4 gap-2"
      onClick={() => setIsOpen(!isOpen)}
    >
      <img
        className={`w-5 h-5 absolute top-4 right-4 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
        src="/chevron-r.svg"
        alt="ChevronR"
        width={20}
        height={20}
      />

      <p className="text-sm font-medium">
        {id}. {question}
      </p>
      {isOpen && <p className="text-zinc-300">{answer}</p>}
    </div>
  );
}
