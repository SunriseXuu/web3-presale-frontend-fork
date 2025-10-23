import Image from "next/image";
import Link from "next/link";

import ProcessCard from "@/components/cards/ProcessCard";
import FaqCard from "@/components/cards/FaqCard";

import { processSteps, faqs } from "@/lib/constants";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col pb-12 gap-6">
      <section className="h-16 flex justify-between items-end bg-primary px-4 pb-2">
        <Link href="/me">
          <Image
            className="w-6 h-6 cursor-pointer rotate-180"
            src="/chevron-r.svg"
            alt="ChevronR"
            width={24}
            height={24}
          />
        </Link>
        <p className="font-bold">Help Center</p>
        <div className="w-6" />
      </section>

      <section className="flex flex-col px-4 gap-4">
        <h1 className="text-2xl font-bold">Purchase Process</h1>

        {processSteps.map((step) => (
          <ProcessCard key={step.process} {...step} />
        ))}
      </section>

      <section className="flex flex-col px-4 gap-4">
        <h1 className="text-2xl font-bold">FAQs</h1>

        <div className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <FaqCard key={faq.id} {...faq} />
          ))}
        </div>
      </section>
    </div>
  );
}
