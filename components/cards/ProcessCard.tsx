export default function ProcessCard({ process, content }: { process: number; content: string }) {
  return (
    <div className="flex items-center bg-neutral rounded-xl pl-4 pr-8 py-4 gap-4">
      <div className="min-w-8 h-8 flex justify-center items-center border border-white rounded-full">
        <span className="w-6 h-6 flex justify-center items-center bg-primary text-xs font-bold rounded-full">
          {process}
        </span>
      </div>
      <span className="text-gray-200">{content}</span>
    </div>
  );
}
