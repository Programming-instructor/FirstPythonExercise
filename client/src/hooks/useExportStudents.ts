import { exportStudents } from '@/services/student';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useExportStudents = () => {
  return useMutation({
    mutationFn: exportStudents,
    onSuccess: (data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در خروجی گرفتن دانش‌آموزان");
    },
  });
};