export interface PrincipalForm {
  familyStatus?: string;
  residenceStatus?: string;
  disciplineStatus?: string;
  advisorReport?: string;
  deputyReport?: string;
  parentCooperation?: string;
  specialTalents?: string;
  specialNeeds?: string;
  familyGoals?: string;
  schoolHistory?: string;
  socialBehavior?: string;
  principalEvaluation?: string;
  principalNotes?: string;
  principalDecision?: string | boolean;
  locked?: boolean;
  _id?: string;
  studentId?: string;
  __v?: number;
}

export interface PrincipalFormResponse {
  form: PrincipalForm;
  exists: boolean;
  locked: boolean;
}