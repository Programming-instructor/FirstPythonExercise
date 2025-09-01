const express = require('express');
const { assignTeacherToClass, addStudentsToClass, getStudentsInClass, getTeacherClasses, deleteClass, addClass, getAllClasses, getClassLevel, distributeStudentsToLevel, autoAddStudentsToClass, getUnassignedStudentsByLevel, getClassName, removeStudentsFromClass, removePeriodFromClass, getAttendance, postAttendance } = require('../controllers/class.controller');
const { authMiddleware, authMiddlewareTeacher, authMiddlewareTeacherAndAdmin } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', authMiddleware, getAllClasses) // full route: /api/class
router.get('/name/:name', authMiddlewareTeacherAndAdmin, getClassName); // full route: /api/class/name/:name
router.get('/level/:classLevel', authMiddleware, getClassLevel); // full route: /api/class/level/:classLevel
router.post('/add', authMiddleware, addClass); // full route: /api/class/add
router.delete('/:classId', authMiddleware, deleteClass); // full route: /api/class/:classId
router.post('/assign-teacher', authMiddleware, assignTeacherToClass); // full route: /api/class/assign-teacher
router.post('/add-students', authMiddleware, addStudentsToClass); // full route: /api/class/add-students
router.post('/remove-students', authMiddleware, removeStudentsFromClass); // full route: /api/class/remove-students
router.post('/remove-period', authMiddleware, removePeriodFromClass); // full route: /api/class/remove-period
router.get('/:classId/students', authMiddleware, getStudentsInClass); // full route: /api/class/:classId/students
router.get('/teacher/:teacherId/classes', authMiddlewareTeacher, getTeacherClasses); // full route: /api/class/teacher/:teacherId/classes
router.post('/distribute-students/:level', authMiddleware, distributeStudentsToLevel); // full route: /api/class/distribute-students/:level
router.post('/auto-add-students/:classId', authMiddleware, autoAddStudentsToClass); // full route: /api/class/auto-add-students/:classId
router.get('/unassigned-students/:level', authMiddleware, getUnassignedStudentsByLevel); // full route: /api/class/unassigned-students/:level
router.post('/attendance', authMiddlewareTeacher, postAttendance); // full route: /api/class/attendance (use teacher auth to ensure only teachers can post)
router.get('/:classId/attendance', authMiddlewareTeacherAndAdmin, getAttendance); // full route: /api/class/:classId/attendance?date=...&day=...&period=...

module.exports = router;