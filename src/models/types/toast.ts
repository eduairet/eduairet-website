export type Toast = {
  id: number;
  message: string;
};

export type ToastHook = {
  toast: Toast | null;
  showToast: (_message: string) => number;
  closeToast: (_id: number) => void;
};
