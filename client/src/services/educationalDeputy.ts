import api from "@/lib/axiosConfig";
import type { DeputyFormResponse, EducationalDeputyForm } from "@/types/educationalDeputy";
import { fieldMapper, type FieldMapperKeys } from "@/utils/fieldMapper";

export const fetchDeputyForm = async (studentId: string): Promise<DeputyFormResponse> => {
  const response = await api.get(`/educational-deputy/${studentId}`);
  return response.data; // Ensure this returns { form, exists, locked }
};

export const submitDeputyForm = async (
  studentId: string,
  formData: Record<string, string>
): Promise<EducationalDeputyForm> => {
  // Map Persian field names to English keys
  const mappedData: Record<string, string> = {};
  (Object.keys(formData) as FieldMapperKeys[]).forEach((key) => {
    const englishKey = fieldMapper[key];
    if (englishKey) {
      mappedData[englishKey] = formData[key];
    }
  });

  const response = await api.post(`/educational-deputy/${studentId}/submit`, mappedData);
  return response.data.form; // Assuming the response returns { form: EducationalDeputyForm }
};