const AcademicAdvisor = require('../models/academicAdvisor.model');
const EducationalDeputy = require('../models/educationalDeputy.model');
const Principal = require('../models/principal.model');
const PsychCounselor = require('../models/psychCounselor.model');

exports.checkStudentAccepted = async (studentId) => {

  const academicAdvisorRecord = await AcademicAdvisor.findOne({ studentId });
  const educationalDeputyRecord = await EducationalDeputy.findOne({ studentId });
  const principalRecord = await Principal.findOne({ studentId });
  const psychCounselorRecord = await PsychCounselor.findOne({ studentId });

  const academicAdvisor = academicAdvisorRecord ? academicAdvisorRecord.advisorDecision : null;
  const educationalDeputy = educationalDeputyRecord ? educationalDeputyRecord.deputyDecision : null;
  const principal = principalRecord ? principalRecord.principalDecision : null;
  const psychCounselor = psychCounselorRecord ? psychCounselorRecord.psychDecision : null;

  const decisions = [academicAdvisor, educationalDeputy, principal, psychCounselor];

  if (decisions.some((d) => d === null)) {
    return null;
  }

  const trueCount = decisions.filter((d) => d === true).length;

  return trueCount >= 2;
}