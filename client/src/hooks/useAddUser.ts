import { addUser } from "@/services/user";
import type { AddUserData, AddUserResponse } from "@/types/user";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";

export const useAddUser = (): UseMutationResult<
  AddUserResponse,
  Error,
  AddUserData
> => {
  return useMutation({
    mutationFn: addUser,
    onError: (error) => {
      console.error('Add User Mutation Error:', error);
    },
  });
};