import { getConfirmedReports } from "@/services/student"
import { useQuery } from "@tanstack/react-query"

export const useGetConfirmedReports = (nCode: string) => {
  return useQuery({
    queryKey: ['fetch-student-confirmed-reports', nCode],
    queryFn: () => getConfirmedReports(nCode),
  })
}