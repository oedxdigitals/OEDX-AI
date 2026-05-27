'use client';

/**
 * Toast Notification System
 */

import { Toaster, toast } from 'react-hot-toast';

export const ToastProvider = () => <Toaster />;

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  promise: <T,>(promise: Promise<T>, messages: { loading: string; success: string; error: string }) =>
    toast.promise(promise, messages),
};
