import { getAllUsers } from "@/services/user";
import type { GetAllUsersResponse } from "@/types/user";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const useGetAllUsers = (): UseQueryResult<GetAllUsersResponse, Error> => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });
};