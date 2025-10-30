"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import ProcessCard from "@/components/cards/ProcessCard";
import FaqCard from "@/components/cards/FaqCard";

export default function HelpPage() {
  const router = useRouter();

  const { t } = useTranslation();

  // 购买流程步骤常量
  const processSteps = [
    { process: 1, content: t("pages.help.processOne") },
    { process: 2, content: t("pages.help.processTwo") },
    { process: 3, content: t("pages.help.processThree") },
    { process: 4, content: t("pages.help.processFour") },
  ];

  // 常见问题常量
  const faqs = [
    { id: 1, question: t("pages.help.faqOneQ"), answer: t("pages.help.faqOneA") },
    { id: 2, question: t("pages.help.faqTwoQ"), answer: t("pages.help.faqTwoA") },
    { id: 3, question: t("pages.help.faqThreeQ"), answer: t("pages.help.faqThreeA") },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-12 gap-6">
      <section className="h-16 flex justify-between items-end bg-primary px-4 pb-2">
        <img
          className="w-6 h-6 cursor-pointer rotate-180"
          src="/chevron-r.svg"
          alt="ChevronR"
          width={24}
          height={24}
          onClick={() => router.back()}
        />
        <p className="font-bold">{t("pages.help.title")}</p>
        <div className="w-6" />
      </section>

      <section className="flex flex-col px-4 gap-4">
        <h1 className="text-2xl font-bold">{t("pages.help.process")}</h1>

        {processSteps.map((step) => (
          <ProcessCard key={step.process} {...step} />
        ))}
      </section>

      <section className="flex flex-col px-4 gap-4">
        <h1 className="text-2xl font-bold">{t("pages.help.faqs")}</h1>

        <div className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <FaqCard key={faq.id} {...faq} />
          ))}
        </div>
      </section>
    </div>
  );
}
