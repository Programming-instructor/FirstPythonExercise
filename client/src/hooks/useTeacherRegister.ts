import api from "@/lib/axiosConfig";
import type { TeacherFormData } from "@/types/teacher";
import { useMutation } from "@tanstack/react-query";

export const useTeacherRegister = () => {
  return useMutation({
    mutationFn: async ({ formData, imageFile }: { formData: TeacherFormData; imageFile: File | null }) => {
      const formDataToSend = new FormData();

      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "subjects") {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Append image if available
      if (imageFile) {
        formDataToSend.append("teacher_portrait_front", imageFile);
      }

      const response = await api.post("/teacher", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Error registering teacher:", error);
      // You might want to add toast notifications here
    },
  });
};