import { fetchMissingAttendanceByDate } from "@/services/class";
import { useQuery } from "@tanstack/react-query";

export const useGetMissingAttendanceByDate = (date: string) => {
  return useQuery({
    queryKey: ['fetch-missing-attendance-by-date', date],
    queryFn: () => fetchMissingAttendanceByDate(date),
    enabled: !!date,
  });
};