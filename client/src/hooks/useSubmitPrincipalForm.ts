import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { reverseMapper } from "@/utils/fieldMapper";
import type { PrincipalForm } from "@/types/principal";
import { submitPrincipalForm } from "@/services/principal";

export const useSubmitPrincipalForm = (): UseMutationResult<
  PrincipalForm,
  Error,
  { studentId: string; formData: Record<string, string> }
> => {
  return useMutation({
    mutationFn: ({ studentId, formData }) => submitPrincipalForm(studentId, formData),
    onSuccess: (data: PrincipalForm) => {
      const mappedData: Record<string, string> = {};
      // Use keyof PrincipalForm to ensure valid keys
      (Object.keys(data) as (keyof PrincipalForm)[]).forEach((key) => {
        if (key === "locked") return; // Skip locked field
        if (reverseMapper[key]) {
          mappedData[reverseMapper[key]] = key === "principalDecision"
            ? data[key] ? "پذیرش" : "عدم پذیرش"
            : (data[key] as string) || "";
        }
      });
      return { ...mappedData, locked: data.locked };
    },
  });
};