import { fetchAllUnconfirmedReports } from "@/services/student"
import { useQuery } from "@tanstack/react-query"

export const useGetAllUnconfirmedReports = () => {
  return useQuery({
    queryKey: ['all-unconfirmed-reports'],
    queryFn: () => fetchAllUnconfirmedReports(),
  })
}