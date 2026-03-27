import { useToastStore } from "../store/useToastStore";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const icons = {
  success: <CheckCircle size={15} className="text-white shrink-0" />,
  error:   <XCircle    size={15} className="text-white shrink-0" />,
  info:    <Info       size={15} className="text-white shrink-0" />,
};

const bg = {
  success: "bg-gray-900",
  error:   "bg-red-600",
  info:    "bg-(--color-accent)",
};

export default function Toaster() {
  const { toasts, remove } = useToastStore();
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium max-w-sm animate-in slide-in-from-bottom-2 ${bg[t.type]}`}
        >
          {icons[t.type]}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="opacity-70 hover:opacity-100 transition-opacity ml-1">
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
