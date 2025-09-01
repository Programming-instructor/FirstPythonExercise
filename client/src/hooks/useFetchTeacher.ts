import { fetchTeacher } from "@/services/teacher"
import { useQuery } from "@tanstack/react-query"

export const useFetchTeacher = () => {
  return useQuery({
    queryKey: ['fetch-curr-teacher'],
    queryFn: fetchTeacher,
  })
}