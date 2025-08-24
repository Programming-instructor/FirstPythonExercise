const mongoose = require("mongoose");

const principalSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

  familyStatus: String,
  residenceStatus: String,
  disciplineStatus: String,
  advisorReport: String,
  deputyReport: String,
  parentCooperation: String,
  specialTalents: String,
  specialNeeds: String,
  familyGoals: String,
  schoolHistory: String,
  socialBehavior: String,
  principalEvaluation: String,
  principalNotes: String,
  principalDecision: { type: Boolean, required: true },

  locked: { type: Boolean, default: false },
});

module.exports = mongoose.model("Principal", principalSchema);
