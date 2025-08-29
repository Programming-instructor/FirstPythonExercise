const express = require('express');
const { assignTeacherToClass, addStudentsToClass, getStudentsInClass, getTeacherClasses, deleteClass, addClass, getAllClasses, getClassLevel, distributeStudentsToLevel, autoAddStudentsToClass, getUnassignedStudentsByLevel, getClassName, removeStudentsFromClass, removePeriodFromClass } = require('../controllers/class.controller');
const router = express.Router();

router.get('/', getAllClasses) // full route: /api/class
router.get('/name/:name', getClassName); // full route: /api/class/name/:name
router.get('/level/:classLevel', getClassLevel); // full route: /api/class/level/:classLevel
router.post('/add', addClass); // full route: /api/class/add
router.delete('/:classId', deleteClass); // full route: /api/class/:classId
router.post('/assign-teacher', assignTeacherToClass); // full route: /api/class/assign-teacher
router.post('/add-students', addStudentsToClass); // full route: /api/class/add-students
router.post('/remove-students', removeStudentsFromClass); // full route: /api/class/remove-students
router.post('/remove-period', removePeriodFromClass); // full route: /api/class/remove-period
router.get('/:classId/students', getStudentsInClass); // full route: /api/class/:classId/students
router.get('/teacher/:teacherId/classes', getTeacherClasses); // full route: /api/class/teacher/:teacherId/classes
router.post('/distribute-students/:level', distributeStudentsToLevel); // full route: /api/class/distribute-students/:level
router.post('/auto-add-students/:classId', autoAddStudentsToClass); // full route: /api/class/auto-add-students/:classId
router.get('/unassigned-students/:level', getUnassignedStudentsByLevel); // full route: /api/class/unassigned-students/:level

module.exports = router;