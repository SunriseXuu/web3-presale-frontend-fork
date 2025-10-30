"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface CountdownTimerProps {
  createdAt: string;
}

function pad(num: number): string {
  return num.toString().padStart(2, "0");
}

export default function CountdownTimer({ createdAt }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    const end = created + 30 * 60 * 1000;
    return Math.max(0, Math.floor((end - now) / 1000));
  });

  const { t } = useTranslation();

  const mm = pad(Math.floor(timeLeft / 60));
  const ss = pad(timeLeft % 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (timeLeft <= 0) return <span className="text-xs text-red-500">{t("shared.countdown.cancelled")}</span>;

  return (
    <span className="text-xs text-orange-500">
      {mm}:{ss} {t("shared.countdown.left")}
    </span>
  );
}
