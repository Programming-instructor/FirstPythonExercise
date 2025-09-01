import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosConfig";
import type { Attendance } from "@/types/class";

export const useGetAttendance = (
  classId: string | undefined,
  date: string,
  day: string | undefined,
  period: string | undefined
) => {
  return useQuery<Attendance[]>({
    queryKey: ["attendance", classId, date, day, period],
    queryFn: async () => {
      if (!classId || !day || !period) {
        return [];
      }
      const res = await api.get<Attendance[]>(`/class/${classId}/attendance`, {
        params: { date, day, period },
      });
      return res.data;
    },
    enabled: !!classId && !!day && !!period && !isNaN(parseInt(period, 10)),
  });
};