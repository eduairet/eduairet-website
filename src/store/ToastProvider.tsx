'use client';

import { createContext, ReactNode, useRef, useState } from 'react';
import { Toast, ToastHook } from '@/models';

export const ToastContext = createContext<ToastHook>({
  toast: null,
  showToast: () => 0,
  closeToast: () => {},
});

interface IProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: IProps) => {
  const [toast, setToast] = useState<Toast | null>(null);
  // A new id remounts the text, so the same message is announced again.
  const nextId = useRef(0);

  const showToast = (message: string) => {
    const id = ++nextId.current;
    setToast({ id, message });
    return id;
  };
  // Closes only that toast, so one feature can't close another's.
  const closeToast = (id: number) =>
    setToast((current) => (current?.id === id ? null : current));

  return (
    <ToastContext.Provider value={{ toast, showToast, closeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
