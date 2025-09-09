import api from "@/lib/axiosConfig";
import type { DeputyFormResponse, DisciplinaryDeputyForm } from "@/types/disciplinaryDeputy";
import { fieldMapper, type FieldMapperKeys } from "@/utils/fieldMapper";

export const fetchDeputyForm = async (studentId: string): Promise<DeputyFormResponse> => {
  const response = await api.get(`/disciplinary-deputy/${studentId}`);
  return response.data; // Ensure this returns { form, exists, locked }
};

export const submitDeputyForm = async (
  studentId: string,
  formData: Record<string, string>
): Promise<DisciplinaryDeputyForm> => {
  // Map Persian field names to English keys
  const mappedData: Record<string, string> = {};
  (Object.keys(formData) as FieldMapperKeys[]).forEach((key) => {
    const englishKey = fieldMapper[key];
    if (englishKey) {
      mappedData[englishKey] = formData[key];
    }
  });

  const response = await api.post(`/disciplinary-deputy/${studentId}/submit`, mappedData);
  return response.data.form; // Assuming the response returns { form: DisciplinaryDeputyForm }
};