import api from "@/lib/axiosConfig";

export const fetchStudentsInClass = async (className: string) => {
  try {
    const response = await api.get(`/class/name/${className}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching students in this class: ', error);
    throw error;
  }
};


export const fetchAttendanceByDate = async (date: string) => {
  try {
    const response = await api.get(`/class/attendance/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching students in this class: ', error);
    throw error;
  }
};

export const fetchMissingAttendanceByDate = async (date: string) => {
  try {
    const response = await api.get(`/class/missing-attendance/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching missing attendance: ', error);
    throw error;
  }
};