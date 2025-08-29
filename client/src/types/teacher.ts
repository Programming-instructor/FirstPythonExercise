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