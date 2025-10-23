import Image from "next/image";
import Link from "next/link";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col pb-6 gap-6">
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
        <p className="font-bold">Profile Settings</p>
        <div className="w-6" />
      </section>
    </div>
  );
}
