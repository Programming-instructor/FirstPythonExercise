import { fetchPsychCounselorForm } from "@/services/psychCounselor";
import type { PsychCounselorForm } from "@/types/psychCounselor";
import { reverseMapper, type FieldMapperKeys, type FieldMapperValues } from "@/utils/fieldMapper";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

type TransformedPsychCounselorForm = {
  form: Partial<Record<FieldMapperKeys, string>>;
  exists: boolean;
  locked: boolean;
};

export const usePsychCounselorForm = (
  studentId?: string
): UseQueryResult<TransformedPsychCounselorForm, Error> => {
  return useQuery({
    queryKey: ["psychCounselorForm", studentId],
    queryFn: () => fetchPsychCounselorForm(studentId!),
    enabled: !!studentId,
    select: (data: { form: PsychCounselorForm | null; exists: boolean; locked: boolean }) => {
      const mappedData: Partial<Record<FieldMapperKeys, string>> = {};
      if (data.form) {
        const form = data.form; // Store in local variable to ensure type narrowing
        (Object.keys(form) as (keyof PsychCounselorForm)[]).forEach((key) => {
          if (key === "locked") return;
          const persianKey = reverseMapper[key as FieldMapperValues] as FieldMapperKeys;
          if (persianKey) {
            mappedData[persianKey] = key === "psychDecision"
              ? form[key] ? "پذیرش" : "عدم پذیرش"
              : (form[key] as string) || "";
          }
        });
      }
      return {
        form: mappedData,
        exists: data.exists,
        locked: data.locked,
      };
    },
  });
};