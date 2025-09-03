// Edited frontend file: types/teacher.ts
export interface TeacherFormData {
  mobile?: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  birth_certificate_number: string;
  national_code: string;
  academic_year: string;
  academic_level: 'high_school_diploma' | 'teaching_diploma' | 'associate_degree' | 'bachelor_degree' | 'master_degree' | 'doctoral_degree' | 'postdoctoral' | 'other_certification';
  teacher_portrait_front?: {
    url?: string;
    public_id?: string;
  };
}

export interface Teacher {
  id: string;
  mobile: string;
  firstName: string;
  lastName: string;
}

export interface TeacherListRes {
  _id: string;
  mobile: string;
  first_name: string;
  last_name: string;
  numberOfReports: number,
}

export interface FullTeacher {
  _id: string;
  mobile: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  birth_certificate_number: string;
  national_code: string;
  academic_year: string;
  academic_level: 'high_school_diploma' | 'teaching_diploma' | 'associate_degree' | 'bachelor_degree' | 'master_degree' | 'doctoral_degree' | 'postdoctoral' | 'other_certification';
  teacher_portrait_front?: {
    url: string;
    public_id: string;
  };
  numberOfReports: number;
  reports: Array<{
    date: string;
    message: string;
  }>;
}