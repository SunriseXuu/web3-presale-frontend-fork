import Image from "next/image";

import ProductCard from "@/components/ProductCard";
import ProcessCard from "@/components/ProcessCard";
import FaqCard from "@/components/FaqCard";
import EarlyAccessForm from "@/components/EarlyAccessForm";

const products = [
  { id: 1, name: "Shampoo", price: 9.99, img: "/shampoo.png" },
  { id: 2, name: "Conditioner", price: 12.5, img: "/conditioner.png" },
  { id: 3, name: "Lotion", price: 15.0, img: "/lotion.png" },
  { id: 4, name: "Sunscreen", price: 20.0, img: "/sunscreen.png" },
  { id: 5, name: "Cleanser", price: 8.0, img: "/cleanser.png" },
  { id: 6, name: "Face Mask", price: 5.5, img: "/facemask.png" },
  { id: 7, name: "Lip Balm", price: 3.0, img: "/lipbalm.png" },
  { id: 8, name: "Body Lotion", price: 18.0, img: "/bodylotion.png" },
];

const processSteps = [
  { process: 1, content: "Connect your favorite Solana wallet, such as Phantom." },
  { process: 2, content: "Browse and select products you like from the gallery." },
  { process: 3, content: "Complete your purchase using USDC." },
  { process: 4, content: "Enjoy your products delivered to your doorstep!" },
];

const faqs = [
  {
    id: 1,
    question: "What payment methods are accepted?",
    answer: "We accept payments in USDC via Solana wallets.",
  },
  {
    id: 2,
    question: "How do I connect my wallet?",
    answer: "Click on the Connect Wallet button in Account page and follow the instructions.",
  },
  {
    id: 3,
    question: "When will I receive my products?",
    answer: "Products will be shipped within 5-7 business days after purchase.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col pb-6 gap-6">
      <section className="relative h-64 overflow-hidden">
        <Image
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto object-cover z-0"
          src="/cover.png"
          alt="Cover"
          width={450}
          height={300}
        />
        <div className="absolute inset-x-0 top-1/3 bottom-0 bg-linear-to-t from-black to-transparent" />

        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
          <h1 className="text-2xl font-bold leading-tight drop-shadow">
            The Only Web3 Presale Platform You'll Ever Need
          </h1>
          <hr className="border-zinc-500" />
          <div className="flex items-center gap-4">
            <Image src="/x.svg" alt="X" width={16} height={16} />
            <Image src="/discord.svg" alt="Discord" width={20} height={20} />
            <Image src="/facebook.svg" alt="Facebook" width={20} height={20} />
            <Image src="/youtube.svg" alt="YouTube" width={22} height={22} />
          </div>
        </div>
      </section>

      <section className="flex flex-col px-6 gap-4">
        <h1 className="text-2xl font-bold">Products Gallery</h1>

        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      <section className="flex flex-col px-6 gap-4">
        <h1 className="text-2xl font-bold">Purchase Process</h1>

        {processSteps.map((step) => (
          <ProcessCard key={step.process} {...step} />
        ))}
      </section>

      <section className="flex flex-col px-6 gap-4">
        <h1 className="text-2xl font-bold">FAQs</h1>

        <div className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <FaqCard key={faq.id} {...faq} />
          ))}
        </div>
      </section>

      <section className="flex flex-col px-6 gap-4">
        <h1 className="text-2xl font-bold">Join for Early Access</h1>
        <EarlyAccessForm />
      </section>
    </div>
  );
}
