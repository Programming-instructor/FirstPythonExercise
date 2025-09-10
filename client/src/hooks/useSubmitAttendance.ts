import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axiosConfig";
import { toast } from "sonner";
import type { AttendanceInput } from "@/types/class";

export const useSubmitAttendance = () => {
  return useMutation<void, Error, {
    classId: string;
    date: string;
    day: string;
    period: number;
    attendances: AttendanceInput[];
  }>({
    mutationFn: async ({ classId, date, day, period, attendances }) => {
      if (!classId || !day || !period) {
        throw new Error("Missing required fields");
      }
      await api.post("/class/attendance", {
        classId,
        date,
        day,
        period,
        attendances,
      });
    },
    onSuccess: () => {
      console.log("Attendance submitted successfully");
      toast.success("حضور و غیاب با موفقیت ارسال شد");
    },
    onError: (error) => {
      console.error("Error submitting attendance:", error);
      toast.error("خطا در ارسال حضور و غیاب");
    },
  });
};
