import { fetchAttendanceByDate } from "@/services/class"
import { useQuery } from "@tanstack/react-query"

export const useGetAttendanceByDate = (date: string) => {
  return useQuery({
    queryKey: ['fetch-attendance-by-date', date],
    queryFn: () => fetchAttendanceByDate(date),
  })
}