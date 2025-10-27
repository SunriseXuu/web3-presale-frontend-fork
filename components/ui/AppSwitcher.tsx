"use client";

import { useState } from "react";

export default function AppSwitcher({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  const [isOn, setIsOn] = useState<boolean>(defaultChecked || false);

  return (
    <div className="flex justify-between items-center select-none">
      <label className="text-sm font-medium">{label}</label>

      <label
        className={`relative w-12 h-7 flex items-center rounded-full border ${
          isOn ? "border-primary" : "border-zinc-600"
        } transition-colors duration-200 cursor-pointer`}
        style={{ minWidth: 48 }}
      >
        <input
          className="peer sr-only"
          name={name}
          checked={isOn}
          onChange={(e) => setIsOn(e.target.checked)}
          type="checkbox"
        />
        <span
          className={`absolute inset-0 rounded-full transition-colors duration-200 ${
            isOn ? "bg-primary" : "bg-neutral"
          }`}
        />
        <span
          className={`absolute top-1/2 left-1/2 w-5 h-5 rounded-full transition-transform duration-200
            ${isOn ? "bg-zinc-300 translate-x-0" : "bg-zinc-600 -translate-x-5"}
            -translate-y-1/2`}
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}
        />
      </label>
    </div>
  );
}
