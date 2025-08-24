export interface PsychCounselorForm {
  mentalStatus?: string;
  confidenceLevel?: string;
  stressLevel?: string;
  socialSkills?: string;
  peerRelations?: string;
  parentRelations?: string;
  familyIssues?: string;
  counselingHistory?: string;
  behaviorIssues?: string;
  personalityStrengths?: string;
  learningStyle?: string;
  studyMotivation?: string;
  psychNotes?: string;
  psychDecision?: string | boolean;
  locked?: boolean;
  _id?: string;
  studentId?: string;
  __v?: number;
}

export interface PsychCounselorFormResponse {
  form: PsychCounselorForm;
  exists: boolean;
  locked: boolean;
}