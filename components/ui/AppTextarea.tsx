export default function AppTextarea({
  id,
  label,
  name,
  placeholder,
  defaultValue,
  rows = 4, // 默认行数为 4 行
}: {
  id: string;
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <div className="flex flex-col select-none gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      <textarea
        id={id}
        className="bg-neutral text-sm border border-zinc-600 focus:border-primary hover:border-primary duration-200 rounded-lg outline-none appearance-none resize-none px-4 py-2"
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={rows}
      />
    </div>
  );
}
