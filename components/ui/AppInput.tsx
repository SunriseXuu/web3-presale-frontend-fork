export default function AppInput({
  id,
  label,
  name,
  placeholder,
  defaultValue,
  type,
}: {
  id: string;
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
  type: string;
}) {
  return (
    <div className="flex flex-col select-none gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      <input
        id={id}
        className="bg-neutral text-sm border border-zinc-600 focus:border-primary hover:border-primary duration-200 rounded-lg outline-none appearance-none px-4 py-2"
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        type={type}
      />
    </div>
  );
}
