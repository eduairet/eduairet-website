import { useContext } from 'react';
import { ToastContext } from '@/store/ToastProvider';

export default function useToast() {
  return useContext(ToastContext);
}
