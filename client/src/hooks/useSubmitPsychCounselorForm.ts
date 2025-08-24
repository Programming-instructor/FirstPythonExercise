import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { reverseMapper } from "@/utils/fieldMapper";
import type { PsychCounselorForm } from "@/types/psychCounselor";
import { submitPsychCounselorForm } from "@/services/psychCounselor";

export const useSubmitPsychCounselorForm = (): UseMutationResult<
  PsychCounselorForm,
  Error,
  { studentId: string; formData: Record<string, string> }
> => {
  return useMutation({
    mutationFn: ({ studentId, formData }) => submitPsychCounselorForm(studentId, formData),
    onSuccess: (data: PsychCounselorForm) => {
      const mappedData: Record<string, string> = {};
      // Use keyof PsychCounselorForm to ensure valid keys
      (Object.keys(data) as (keyof PsychCounselorForm)[]).forEach((key) => {
        if (key === "locked") return; // Skip locked field
        if (reverseMapper[key]) {
          mappedData[reverseMapper[key]] = key === "psychDecision"
            ? data[key] ? "پذیرش" : "عدم پذیرش"
            : (data[key] as string) || "";
        }
      });
      return { ...mappedData, locked: data.locked };
    },
  });
};