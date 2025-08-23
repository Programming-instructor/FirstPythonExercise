// Interface for the Commitment object
interface Commitment {
  discipline: boolean;
  rules: boolean;
}

// Interface for the StudentPortraitFront object
interface StudentPortraitFront {
  url: string;
  public_id: string;
}

// Interface for the Student object
export interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  national_code: string;
  birth_date: string;
  birth_certificate_number: string;
  student_phone: string;
  father_phone: string;
  father_job: string;
  mother_phone: string;
  academic_year: string;
  education_level: string;
  mother_job: string;
  grade: number;
  emergency_phone: string;
  marital_status: string;
  previous_school_address: string;
  home_address: string;
  residence_status: string;
  postal_code: string;
  home_phone: string;
  appearance_neat: boolean;
  polite_behavior: boolean;
  family_involvement: boolean;
  student_goal: string;
  academic_status: string;
  commitment: Commitment;
  evaluation_result: string;
  student_portrait_front: StudentPortraitFront;
  __v: number;
}

export interface StudentFormData {
  [key: string]: any;
  guardian: {
    name: string;
    relation: string;
    phone: string;
  };
}

export interface StudentResponse {
  students: Student[];
  total: number;
  page: number;
  totalPages: number;
}