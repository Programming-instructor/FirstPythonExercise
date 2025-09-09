// frontend/hooks/useDisciplinaryDeputyForm.ts
import { fetchDeputyForm } from "@/services/disciplinaryDeputy";
import type { DisciplinaryDeputyForm } from "@/types/disciplinaryDeputy";
import { reverseMapper, type FieldMapperKeys, type FieldMapperValues } from "@/utils/fieldMapper";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

type TransformedDeputyForm = {
  form: Partial<Record<FieldMapperKeys, string>>;
  exists: boolean;
  locked: boolean;
};

export const useDisciplinaryDeputyForm = (
  studentId?: string
): UseQueryResult<TransformedDeputyForm, Error> => {
  return useQuery({
    queryKey: ["disciplinaryDeputyForm", studentId],
    queryFn: () => fetchDeputyForm(studentId!),
    enabled: !!studentId,
    select: (data: { form: DisciplinaryDeputyForm | null; exists: boolean; locked: boolean }) => {
      const mappedData: Partial<Record<FieldMapperKeys, string>> = {};
      if (data.form) {
        const form = data.form; // Store in local variable to ensure type narrowing
        (Object.keys(form) as (keyof DisciplinaryDeputyForm)[]).forEach((key) => {
          if (key === "locked") return;
          const persianKey = reverseMapper[key as FieldMapperValues] as FieldMapperKeys;
          if (persianKey) {
            mappedData[persianKey] = key === "deputyDecision"
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