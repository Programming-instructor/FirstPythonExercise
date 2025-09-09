const mongoose = require("mongoose");

const disciplinaryDeputySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

  pastDisciplinaryRecords: String,
  lastYearDisciplinaryReport: String,
  classBehavior: String,
  reportedIncidents: String,
  peerConflicts: String,
  ruleCompliance: String,
  teacherInteractions: String,
  specialSupervisionNeeds: String,
  disciplinarySuggestions: String,
  deputyNotes: String,
  deputyDecision: { type: Boolean, required: true },

  locked: { type: Boolean, default: false },
});

module.exports = mongoose.model("DisciplinaryDeputy", disciplinaryDeputySchema);