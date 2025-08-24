import { fetchAdvisorForm } from "@/services/academic-advisor";
import type { AcademicAdvisorForm } from "@/types/academicAdvisor";
import { reverseMapper, type FieldMapperKeys, type FieldMapperValues } from "@/utils/fieldMapper";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

type TransformedAdvisorForm = {
  form: Partial<Record<FieldMapperKeys, string>>;
  exists: boolean;
  locked: boolean;
};

export const useAcademicAdvisorForm = (
  studentId?: string
): UseQueryResult<TransformedAdvisorForm, Error> => {
  return useQuery({
    queryKey: ["academicAdvisorForm", studentId],
    queryFn: () => fetchAdvisorForm(studentId!),
    enabled: !!studentId,
    select: (data: { form: AcademicAdvisorForm; exists: boolean; locked: boolean }) => {
      const mappedData: Partial<Record<FieldMapperKeys, string>> = {};
      (Object.keys(data.form) as (keyof AcademicAdvisorForm)[]).forEach((key) => {
        if (key === "locked") return;
        const persianKey = reverseMapper[key as FieldMapperValues] as FieldMapperKeys;
        if (persianKey) {
          mappedData[persianKey] = key === "advisorDecision"
            ? data.form[key] ? "پذیرش" : "عدم پذیرش"
            : (data.form[key] as string) || "";
        }
      });
      return {
        form: mappedData,
        exists: data.exists,
        locked: data.locked,
      };
    },
  });
};