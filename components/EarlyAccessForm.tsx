"use client";

export default function EarlyAccessForm() {
  // 处理邮箱提交
  async function submitEmailAction(formData: FormData) {
    const email = formData.get("email") as string;

    // 这里可以添加提交邮箱的逻辑，例如发送到服务器
    console.log("Submitted email:", email);
  }

  return (
    <form action={submitEmailAction} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full px-4 py-2 rounded-lg bg-neutral border border-zinc-600 focus:border-primary hover:border-primary duration-200 outline-none"
      />
      <button className="w-full h-10 bg-primary rounded-lg font-medium">Join Now</button>
    </form>
  );
}
