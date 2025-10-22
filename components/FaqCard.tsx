"use client";

import { useState } from "react";
import Image from "next/image";

export default function FaqCard({ id, question, answer }: { id: number; question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col bg-neutral rounded-xl p-4 gap-2" onClick={() => setIsOpen(!isOpen)}>
      <Image
        className={`absolute top-5 right-4 cursor-pointer transition-transform duration-200 ${
          isOpen ? "rotate-180" : "rotate-90"
        }`}
        src="/chevron.svg"
        alt="Chevron"
        width={16}
        height={16}
      />

      <h2 className="font-medium">
        {id}. {question}
      </h2>
      {isOpen && <p className="text-gray-300 text-sm">{answer}</p>}
    </div>
  );
}
