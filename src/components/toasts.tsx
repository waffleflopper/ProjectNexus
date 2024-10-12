import React, { useEffect, useState } from "react";
import { atom } from "nanostores";
import { useStore } from "@nanostores/react";
import { v4 as uuidv4 } from "uuid";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

const toastsAtom = atom<Toast[]>([]);

export const Toast: React.FC<Toast> = ({
  id,
  message,
  type,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration]);

  return (
    <div
      className={`border-4 border-black rounded-xl p-4 mb-2 shadow-[6px_6px_0_0_rgba(0,0,0,1)] min-w-[300px] flex flex-col ${
        type === "success"
          ? "bg-primary text-primary-foreground"
          : type === "error"
            ? "bg-destructive text-destructive-foreground"
            : "bg-muted text-card-foreground"
      }`}>
      <p className="mb-2">{message}</p>
      <div className="flex justify-end">
        <button
          onClick={() => removeToast(id)}
          className="bg-muted border-2 border-black text-muted-foreground rounded-lg px-2 py-1 shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100">
          Dismiss
        </button>
      </div>
    </div>
  );
};

const ToastList: React.FC = () => {
  const $toasts = useStore(toastsAtom);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {$toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
        />
      ))}
    </div>
  );
};

/* just for demo and testing purposes */
export const AddToastButton: React.FC<{
  type?: Toast["type"];
  message?: string;
}> = ({ type = "success", message = "Hello, world!" }) => {
  const bgClass =
    type === "success"
      ? "bg-primary"
      : type === "error"
        ? "bg-destructive"
        : "bg-card";
  return (
    <button
      onClick={() => addToast({ message, type })}
      className={`${bgClass} border-2 border-black text-primary-foreground rounded-lg p-2 shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100`}>
      Add{" "}
      {`${type === "success" ? "Success" : type === "error" ? "Error" : "Info"}`}{" "}
      Toast
    </button>
  );
};

const removeToast = (id: string) => {
  const $toasts = toastsAtom.get();
  toastsAtom.set($toasts.filter((t) => t.id !== id));
};

const addToast = (toast: Omit<Toast, "id">) => {
  const $toasts = toastsAtom.get();
  const id = uuidv4();
  toastsAtom.set([...$toasts, { ...toast, id }]);
};

export { ToastList, addToast };
