const mongoose = require("mongoose");

const academicAdvisorSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

  academicStrengths: String,
  academicWeaknesses: String,
  academicInterests: String,
  preferredMajor: String,
  disciplineStatus: String,
  dailyStudyHours: String,
  extraActivities: String,
  needsTutoring: String,
  classParticipation: String,
  homeworkStatus: String,
  learningSkills: String,
  advisorNotes: String,
  advisorDecision: { type: Boolean, required: true },

  locked: { type: Boolean, default: false },
});

module.exports = mongoose.model("AcademicAdvisor", academicAdvisorSchema);
