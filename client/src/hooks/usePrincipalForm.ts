import { fetchPrincipalForm } from "@/services/principal";
import type { PrincipalForm } from "@/types/principal";
import { reverseMapper, type FieldMapperKeys, type FieldMapperValues } from "@/utils/fieldMapper";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

type TransformedPrincipalForm = {
  form: Partial<Record<FieldMapperKeys, string>>;
  exists: boolean;
  locked: boolean;
};

export const usePrincipalForm = (
  studentId?: string
): UseQueryResult<TransformedPrincipalForm, Error> => {
  return useQuery({
    queryKey: ["principalForm", studentId],
    queryFn: () => fetchPrincipalForm(studentId!),
    enabled: !!studentId,
    select: (data: { form: PrincipalForm | null; exists: boolean; locked: boolean }) => {
      const mappedData: Partial<Record<FieldMapperKeys, string>> = {};
      if (data.form) {
        const form = data.form; // Store in local variable to ensure type narrowing
        (Object.keys(form) as (keyof PrincipalForm)[]).forEach((key) => {
          if (key === "locked") return;
          const persianKey = reverseMapper[key as FieldMapperValues] as FieldMapperKeys;
          if (persianKey) {
            mappedData[persianKey] = key === "principalDecision"
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