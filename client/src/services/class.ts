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

export const deleteClass = async (classId: string) => {
  try {
    const response = await api.delete(`/class/${classId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting class: ', error);
    throw error;
  }
};

export const updateAttendanceByDeputy = async (data: {
  className: string;
  date: string;
  day: string;
  period: number;
  attendances: { studentId: string; status: 'present' | 'absent' | 'late' }[];
  report: string;
}) => {
  try {
    const response = await api.post('/class/attendance/update-deputy', data);
    return response.data;
  } catch (error) {
    console.error('Error updating attendance by deputy: ', error);
    throw error;
  }
};

export const confirmByDisciplinaryDeputy = async (data: {
  className: string;
  date: string;
  day: string;
  period: number;
}) => {
  try {
    const response = await api.post('/class/attendance/confirm-deputy', data);
    return response.data;
  } catch (error) {
    console.error('Error confirming by disciplinary deputy: ', error);
    throw error;
  }
};



export const confirmByPrincipal = async (data: {
  className: string;
  date: string;
  day: string;
  period: number;
}) => {
  try {
    const response = await api.post('/class/attendance/confirm-principal', data);
    return response.data;
  } catch (error) {
    console.error('Error confirming by principal: ', error);
    throw error;
  }
};
