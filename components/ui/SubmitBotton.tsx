import { useFormStatus } from "react-dom";

export default function SubmitBotton({ text, pendingText }: { text: string; pendingText: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full flex justify-center items-center bg-primary disabled:bg-primary/25 font-semibold rounded-xl select-none cursor-pointer py-2.5 gap-2"
      type="submit"
      disabled={pending}
    >
      {pending && <img className="animate-spin" src="/loading.svg" alt="Loading" width={16} height={16} />}
      <span>{pending ? pendingText : text}</span>
    </button>
  );
}
