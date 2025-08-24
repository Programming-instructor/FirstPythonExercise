
export interface AcademicAdvisorForm {
  lastYearAverage?: string;
  academicStrengths?: string;
  academicWeaknesses?: string;
  academicInterests?: string;
  preferredMajor?: string;
  disciplineStatus?: string;
  dailyStudyHours?: string;
  extraActivities?: string;
  needsTutoring?: string;
  classParticipation?: string;
  homeworkStatus?: string;
  learningSkills?: string;
  advisorNotes?: string;
  advisorDecision?: string | boolean;
  locked?: boolean;
  _id?: string;
  studentId?: string;
  __v?: number;
}

export interface AdvisorFormResponse {
  form: AcademicAdvisorForm;
  exists: boolean;
  locked: boolean;
}