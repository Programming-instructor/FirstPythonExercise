import api from "@/lib/axiosConfig";
import type { PsychCounselorForm, PsychCounselorFormResponse } from "@/types/psychCounselor";
import { fieldMapper, type FieldMapperKeys } from "@/utils/fieldMapper";

export const fetchPsychCounselorForm = async (studentId: string): Promise<PsychCounselorFormResponse> => {
  const response = await api.get(`/psych-counselor/${studentId}`);
  return response.data; // Ensure this returns { form, exists, locked }
};

export const submitPsychCounselorForm = async (
  studentId: string,
  formData: Record<string, string>
): Promise<PsychCounselorForm> => {
  // Map Persian field names to English keys
  const mappedData: Record<string, string> = {};
  (Object.keys(formData) as FieldMapperKeys[]).forEach((key) => {
    const englishKey = fieldMapper[key];
    if (englishKey) {
      mappedData[englishKey] = formData[key];
    }
  });

  const response = await api.post(`/psych-counselor/${studentId}/submit`, mappedData);
  return response.data.form; // Assuming the response returns { form: PsychCounselorForm }
};