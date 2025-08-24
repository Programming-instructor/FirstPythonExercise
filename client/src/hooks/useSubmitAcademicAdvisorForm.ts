import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { submitAdvisorForm } from "@/services/academic-advisor";
import { reverseMapper } from "@/utils/fieldMapper";
import type { AcademicAdvisorForm } from "@/types/academicAdvisor";


export const useSubmitAcademicAdvisorForm = (): UseMutationResult<
  AcademicAdvisorForm,
  Error,
  { studentId: string; formData: Record<string, string> }
> => {
  return useMutation({
    mutationFn: ({ studentId, formData }) => submitAdvisorForm(studentId, formData),
    onSuccess: (data: AcademicAdvisorForm) => {
      const mappedData: Record<string, string> = {};
      // Use keyof AcademicAdvisorForm to ensure valid keys
      (Object.keys(data) as (keyof AcademicAdvisorForm)[]).forEach((key) => {
        if (key === "locked") return; // Skip locked field
        if (reverseMapper[key]) {
          mappedData[reverseMapper[key]] = key === "advisorDecision"
            ? data[key] ? "پذیرش" : "عدم پذیرش"
            : (data[key] as string) || "";
        }
      });
      return { ...mappedData, locked: data.locked };
    },
  });
};