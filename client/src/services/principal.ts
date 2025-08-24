import api from "@/lib/axiosConfig";
import type { PrincipalForm, PrincipalFormResponse } from "@/types/principal";
import { fieldMapper, type FieldMapperKeys } from "@/utils/fieldMapper";

export const fetchPrincipalForm = async (studentId: string): Promise<PrincipalFormResponse> => {
  const response = await api.get(`/principal/${studentId}`);
  return response.data; // Ensure this returns { form, exists, locked }
};

export const submitPrincipalForm = async (
  studentId: string,
  formData: Record<string, string>
): Promise<PrincipalForm> => {
  // Map Persian field names to English keys
  const mappedData: Record<string, string> = {};
  (Object.keys(formData) as FieldMapperKeys[]).forEach((key) => {
    const englishKey = fieldMapper[key];
    if (englishKey) {
      mappedData[englishKey] = formData[key];
    }
  });

  const response = await api.post(`/principal/${studentId}/submit`, mappedData);
  return response.data.form; // Assuming the response returns { form: PrincipalForm }
};