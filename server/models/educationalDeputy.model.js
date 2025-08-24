const mongoose = require("mongoose");

const educationalDeputySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

  submittedDocuments: String,
  lastYearReport: String,
  coreSubjectsScore: String,
  disciplineStatus: String,
  attendanceHistory: String,
  transferStatus: String,
  foreignLanguageLevel: String,
  classEngagement: String,
  pastIssues: String,
  specialRequirements: String,
  classPlacementSuggestion: String,
  academicHistory: String,
  deputyNotes: String,
  deputyDecision: { type: Boolean, required: true },

  locked: { type: Boolean, default: false },
});

module.exports = mongoose.model("EducationalDeputy", educationalDeputySchema);
