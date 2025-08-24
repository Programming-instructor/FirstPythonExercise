export interface EducationalDeputyForm {
  submittedDocuments?: string;
  lastYearReport?: string;
  coreSubjectsScore?: string;
  disciplineStatus?: string;
  attendanceHistory?: string;
  transferStatus?: string;
  foreignLanguageLevel?: string;
  classEngagement?: string;
  pastIssues?: string;
  specialRequirements?: string;
  classPlacementSuggestion?: string;
  academicHistory?: string;
  deputyNotes?: string;
  deputyDecision?: string | boolean;
  locked?: boolean;
  _id?: string;
  studentId?: string;
  __v?: number;
}

export interface DeputyFormResponse {
  form: EducationalDeputyForm;
  exists: boolean;
  locked: boolean;
}