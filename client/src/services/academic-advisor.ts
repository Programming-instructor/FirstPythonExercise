import api from "@/lib/axiosConfig";
import type { AcademicAdvisorForm, AdvisorFormResponse } from "@/types/academicAdvisor";
import { fieldMapper, type FieldMapperKeys } from "@/utils/fieldMapper";

export const fetchAdvisorForm = async (studentId: string): Promise<AdvisorFormResponse> => {
  const response = await api.get(`/academic-advisor/${studentId}`);
  return response.data; // Ensure this returns { form, exists, locked }
};

export const submitAdvisorForm = async (
  studentId: string,
  formData: Record<string, string>
): Promise<AcademicAdvisorForm> => {
  // Map Persian field names to English keys
  const mappedData: Record<string, string> = {};
  (Object.keys(formData) as FieldMapperKeys[]).forEach((key) => {
    const englishKey = fieldMapper[key];
    if (englishKey) {
      mappedData[englishKey] = formData[key];
    }
  });

  const response = await api.post(`/academic-advisor/${studentId}/submit`, mappedData);
  return response.data.form; // Assuming the response returns { form: AcademicAdvisorForm }
};