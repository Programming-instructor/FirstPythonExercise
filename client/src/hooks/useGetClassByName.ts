import { fetchStudentsInClass } from "@/services/class"
import { useQuery } from "@tanstack/react-query"

export const useGetClassByName = (className: string) => {
  return useQuery({
    queryKey: ['fetch-student-in-class', className],
    queryFn: () => fetchStudentsInClass(className),
  })
}