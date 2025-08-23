import { fetchStudentByNationalCode } from "@/services/student";
import { useQuery } from "@tanstack/react-query";

export const useFetchStudentByCode = (national_code: string) => {
  return useQuery({
    queryKey: ['fetch-student', national_code],
    queryFn: () => fetchStudentByNationalCode(national_code),
    enabled: !!national_code && /^\d{10}$/.test(national_code),
  });
};