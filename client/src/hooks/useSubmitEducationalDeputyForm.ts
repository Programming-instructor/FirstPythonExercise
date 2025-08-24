import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { reverseMapper } from "@/utils/fieldMapper";
import type { EducationalDeputyForm } from "@/types/educationalDeputy";
import { submitDeputyForm } from "@/services/educationalDeputy";

export const useSubmitEducationalDeputyForm = (): UseMutationResult<
  EducationalDeputyForm,
  Error,
  { studentId: string; formData: Record<string, string> }
> => {
  return useMutation({
    mutationFn: ({ studentId, formData }) => submitDeputyForm(studentId, formData),
    onSuccess: (data: EducationalDeputyForm) => {
      const mappedData: Record<string, string> = {};
      // Use keyof EducationalDeputyForm to ensure valid keys
      (Object.keys(data) as (keyof EducationalDeputyForm)[]).forEach((key) => {
        if (key === "locked") return; // Skip locked field
        if (reverseMapper[key]) {
          mappedData[reverseMapper[key]] = key === "deputyDecision"
            ? data[key] ? "پذیرش" : "عدم پذیرش"
            : (data[key] as string) || "";
        }
      });
      return { ...mappedData, locked: data.locked };
    },
  });
};