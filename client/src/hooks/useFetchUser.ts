import { fetchUser } from "@/services/user"
import { useQuery } from "@tanstack/react-query"

export const useFetchUser = () => {
  return useQuery({
    queryKey: ['fetch-curr-user'],
    queryFn: fetchUser,
  })
}