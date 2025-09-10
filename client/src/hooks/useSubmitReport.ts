import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axiosConfig";
import { toast } from "sonner";

export const useSubmitReport = () => {
  return useMutation<void, Error, {
    classId: string;
    date: string;
    day: string;
    period: number;
    report: string;
  }>({
    mutationFn: async ({ classId, date, day, period, report }) => {
      if (!classId || !day || !period) {
        throw new Error("Missing required fields");
      }
      await api.post("/class/attendance/report", {
        classId,
        date,
        day,
        period,
        report,
      });
    },
    onSuccess: () => {
      console.log("Report submitted successfully");
      toast.success("گزارش با موفقیت ارسال شد");
    },
    onError: (error) => {
      console.error("Error submitting report:", error);
      toast.error("خطا در ارسال گزارش");
    },
  });
};