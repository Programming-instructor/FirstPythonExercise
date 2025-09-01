
export interface Teacher {
  _id: string;
  first_name: string;
  last_name: string;
  mobile: string;
}

export interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  national_code: string;
}

export interface Period {
  subject: string;
  teacher: Teacher;
  _id: string;
}

export interface Days {
  saturday: Period[];
  sunday: Period[];
  monday: Period[];
  tuesday: Period[];
  wednesday: Period[];
  thursday: Period[];
  friday: Period[];
}

export interface ClassData {
  _id: string;
  name: string;
  level: string;
  days: Days;
  students: Student[];
}

export interface AttendanceRecord {
  student: Student;
  status: "present" | "absent" | "late";
}

export interface Attendance {
  _id?: string;
  date: string;
  day: string;
  period: number;
  subject: string;
  teacher: Teacher;
  studentsAttendance: AttendanceRecord[];
  report: string;
}

export interface AttendanceInput {
  studentId: string;
  status: "present" | "absent" | "late";
}
