import api from "@/lib/axiosConfig";

export const postStudentData = async (formData: FormData) => {
  try {
    const res = await api.post('/student', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    console.error('Error posting student: ', error);
  }
};

export const fetchStudents = async (page: number, limit: number, search: string) => {
  try {
    const response = await api.get(`/student?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching students: ', error);
  }
};

export const importStudents = async (file: File) => {
  try {
    if (!["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(file.type)) {
      throw new Error("لطفاً یک فایل اکسل معتبر (.xlsx یا .xls) انتخاب کنید");
    }
    const formData = new FormData();
    formData.append("file", file);
    await api.post("/student/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (err) {
    console.error('Error importing students: ', err);
  }
};

export const exportStudents = async (): Promise<Blob> => {
  const response = await api.get("/student/export", { responseType: "blob" });
  return response.data;
};