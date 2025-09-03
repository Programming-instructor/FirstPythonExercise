import { fetchStudent } from "@/services/student"
import { useQuery } from "@tanstack/react-query"

export const useFetchStudent = () => {
  return useQuery({
    queryKey: ['fetch-curr-student'],
    queryFn: fetchStudent,
  })
}