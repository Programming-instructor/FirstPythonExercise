export interface DisciplinaryDeputyForm {
  pastDisciplinaryRecords?: string;
  lastYearDisciplinaryReport?: string;
  classBehavior?: string;
  reportedIncidents?: string;
  peerConflicts?: string;
  ruleCompliance?: string;
  teacherInteractions?: string;
  specialSupervisionNeeds?: string;
  disciplinarySuggestions?: string;
  deputyNotes?: string;
  deputyDecision?: string | boolean;
  locked?: boolean;
  _id?: string;
  studentId?: string;
  __v?: number;
}

export interface DeputyFormResponse {
  form: DisciplinaryDeputyForm;
  exists: boolean;
  locked: boolean;
}