import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { reverseMapper } from "@/utils/fieldMapper";
import { submitDeputyForm } from "@/services/disciplinaryDeputy";
import type { DisciplinaryDeputyForm } from "@/types/disciplinaryDeputy";

export const useSubmitDisciplinaryDeputyForm = (): UseMutationResult<
  DisciplinaryDeputyForm,
  Error,
  { studentId: string; formData: Record<string, string> }
> => {
  return useMutation({
    mutationFn: ({ studentId, formData }) => submitDeputyForm(studentId, formData),
    onSuccess: (data: DisciplinaryDeputyForm) => {
      const mappedData: Record<string, string> = {};
      // Use keyof DisciplinaryDeputyForm to ensure valid keys
      (Object.keys(data) as (keyof DisciplinaryDeputyForm)[]).forEach((key) => {
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