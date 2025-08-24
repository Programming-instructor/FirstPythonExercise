import { fetchDecisionsByNationalCode } from "@/services/student";
import { useQuery } from "@tanstack/react-query";

export const useFetchDecisionsByNationalCode = (national_code: string) => {
  return useQuery({
    queryKey: ['fetch-student-eval', national_code],
    queryFn: () => fetchDecisionsByNationalCode(national_code),
    enabled: !!national_code && /^\d{10}$/.test(national_code),
  });
};