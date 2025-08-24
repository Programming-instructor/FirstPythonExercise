const mongoose = require("mongoose");

const psychCounselorSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

  mentalStatus: String,
  confidenceLevel: String,
  stressLevel: String,
  socialSkills: String,
  peerRelations: String,
  parentRelations: String,
  familyIssues: String,
  counselingHistory: String,
  behaviorIssues: String,
  personalityStrengths: String,
  learningStyle: String,
  studyMotivation: String,
  psychNotes: String,
  psychDecision: { type: Boolean, required: true },

  locked: { type: Boolean, default: false },
});

module.exports = mongoose.model("PsychCounselor", psychCounselorSchema);
