const Class = require('../models/class.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');

// 1. Assign teacher to a class (day + subject/period)
exports.assignTeacherToClass = async (req, res) => {
  try {
    const { classId, day, subject, teacherId, period } = req.body;

    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    if (!cls.days[day]) return res.status(400).json({ message: 'Invalid day' });

    // If period is provided → replace that period
    console.log(cls.days[day].length);
    if (period) {
      if (cls.days[day].length < period) {
        return res.status(400).json({ message: 'Invalid period index' });
      }
      cls.days[day][period - 1] = { subject, teacher: teacherId };
    } else {
      // Otherwise push as a new period
      cls.days[day].push({ subject, teacher: teacherId });
    }

    await cls.save();
    res.json({ message: 'Teacher assigned successfully', cls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Add student(s) to class by national code
exports.addStudentsToClass = async (req, res) => {
  try {
    const { classId, nationalCodes } = req.body; // nationalCodes: array

    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    const students = await Student.find({ national_code: { $in: nationalCodes } });
    if (!students.length) return res.status(404).json({ message: 'No students found' });

    for (let student of students) {
      if (!cls.students.includes(student._id)) {
        cls.students.push(student._id);
      }
      student.class = cls._id; // update student's class reference
      await student.save();
    }

    await cls.save();

    res.json({ message: 'Students added successfully', students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Get all students in a class
exports.getStudentsInClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const cls = await Class.findById(classId).populate('students');
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    res.json(cls.students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Get all classes a teacher has (flattened schedule)
exports.getTeacherClasses = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const classes = await Class.find({}).populate('days.sunday.teacher days.monday.teacher days.tuesday.teacher days.wednesday.teacher days.thursday.teacher days.friday.teacher days.saturday.teacher');

    let result = [];

    for (let cls of classes) {
      for (let day of Object.keys(cls.days)) {
        cls.days[day].forEach((periodObj, index) => {
          if (periodObj.teacher && periodObj.teacher._id.toString() === teacherId) {
            result.push({
              day: day,
              period: index + 1,
              className: cls.name,
              periodName: periodObj.subject
            });
          }
        });
      }
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new class
exports.addClass = async (req, res) => {
  try {
    const { name, level } = req.body;

    if (!name || !level) {
      return res.status(400).json({ message: 'Class name and level are required' });
    }

    // Prevent duplicates
    const exists = await Class.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: 'Class with this name already exists' });
    }

    const newClass = new Class({ name, level });
    await newClass.save();

    res.status(201).json({ message: 'Class created successfully', class: newClass });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a class by ID
exports.deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const cls = await Class.findByIdAndDelete(classId);
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Optionally: update students who belonged to this class
    await Student.updateMany({ class: classId }, { $unset: { class: "" } });

    res.json({ message: 'Class deleted successfully', deletedClass: cls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('students', 'first_name last_name national_code'); // only students

    // Ensure students array is always present
    const formatted = classes.map(cls => ({
      _id: cls._id,
      name: cls.name,
      days: cls.days,
      students: cls.students || [],
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

// Get a class by Name
exports.getClassName = async (req, res) => {
  try {
    const { name } = req.params;

    const cls = await Class.findOne({ name: name })
      .populate('students', 'first_name last_name national_code')
      .populate('days.saturday.teacher days.sunday.teacher days.monday.teacher days.tuesday.teacher days.wednesday.teacher days.thursday.teacher days.friday.teacher', 'first_name last_name mobile');

    if (!cls) return res.status(404).json({ message: 'Class not found' });

    // Ensure students array is always present
    const formatted = {
      _id: cls._id,
      name: cls.name,
      level: cls.level,
      days: cls.days,
      students: cls.students || [],
    };

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error fetching class by id: ', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a class by level
exports.getClassLevel = async (req, res) => {
  try {
    const { classLevel } = req.params;

    const cls = await Class.find({ level: classLevel })
      .populate('students', 'first_name last_name national_code')
      .populate('days.sunday.teacher days.monday.teacher days.tuesday.teacher days.wednesday.teacher days.thursday.teacher days.friday.teacher days.saturday.teacher', 'first_name last_name mobile');

    res.status(200).json(cls);
  } catch (err) {
    console.error('Error fetching class by id: ', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Distribute students to classes in a level based on grades (balanced)
exports.distributeStudentsToLevel = async (req, res) => {
  try {
    const { level } = req.params;

    if (!['10', '11', '12'].includes(level)) {
      return res.status(400).json({ message: 'Invalid level' });
    }

    let classes = await Class.find({ level });
    if (!classes.length) {
      return res.status(404).json({ message: 'No classes found for this level' });
    }

    const students = await Student.find({ education_level: level, class: { $exists: false } }).sort({ grade: -1 });
    if (!students.length) {
      return res.status(404).json({ message: 'No unassigned students found for this level' });
    }

    for (let student of students) {
      // Find class with minimum number of students
      let minClass = classes.reduce((min, c) =>
        c.students.length < min.students.length ? c : min,
        classes[0]
      );

      minClass.students.push(student._id);
      student.class = minClass._id;
      await student.save();
    }

    // Save all updated classes
    await Promise.all(classes.map(c => c.save()));

    res.json({ message: 'Students distributed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Automatically add unassigned students to a specific class (sorted by grades)
exports.autoAddStudentsToClass = async (req, res) => {
  try {
    const { classId } = req.params;

    let cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const level = cls.level;
    if (!level) {
      return res.status(400).json({ message: 'Class has no level defined' });
    }

    const students = await Student.find({ education_level: level, class: { $exists: false } }).sort({ average_grade: -1 });
    if (!students.length) {
      return res.status(404).json({ message: 'No unassigned students found for this level' });
    }

    for (let student of students) {
      cls.students.push(student._id);
      student.class = cls._id;
      await student.save();
    }

    await cls.save();

    res.json({ message: 'Students added automatically to the class' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get unassigned students by level
exports.getUnassignedStudentsByLevel = async (req, res) => {
  try {
    const { level } = req.params;

    if (!['10', '11', '12'].includes(level)) {
      return res.status(400).json({ message: 'Invalid level' });
    }

    const students = await Student.find({ education_level: level, class: { $exists: false } })
      .select('first_name last_name national_code');

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove student(s) from a class
exports.removeStudentsFromClass = async (req, res) => {
  try {
    const { classId, nationalCodes } = req.body; // nationalCodes: array

    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    const students = await Student.find({ national_code: { $in: nationalCodes } });
    if (!students.length) return res.status(404).json({ message: 'No students found' });

    for (let student of students) {
      cls.students = cls.students.filter(studentId => studentId.toString() !== student._id.toString());
      await Student.updateOne({ _id: student._id }, { $unset: { class: "" } });
    }

    await cls.save();

    res.json({ message: 'Students removed successfully', students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a period from a class
exports.removePeriodFromClass = async (req, res) => {
  try {
    const { classId, day, period } = req.body;

    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    if (!cls.days[day]) return res.status(400).json({ message: 'Invalid day' });

    if (cls.days[day].length < period || period < 1) {
      return res.status(400).json({ message: 'Invalid period index' });
    }

    cls.days[day].splice(period - 1, 1);

    await cls.save();
    res.json({ message: 'Period removed successfully', cls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.postAttendance = async (req, res) => {
  try {
    const { classId, date, day, period, attendances } = req.body;

    // Validate required fields
    if (!classId || !date || !day || !period || !attendances || !Array.isArray(attendances)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Validate day and period exist in schedule
    if (!cls.days[day] || cls.days[day].length < period || period < 1) {
      return res.status(400).json({ message: 'Invalid day or period for this class' });
    }

    const schedulePeriod = cls.days[day][period - 1];

    // Optional: Validate that attendances cover all students in the class
    const classStudentIds = cls.students.map(s => s.toString());
    const providedStudentIds = attendances.map(a => a.studentId.toString());
    if (classStudentIds.length !== providedStudentIds.length || !classStudentIds.every(id => providedStudentIds.includes(id))) {
      return res.status(400).json({ message: 'Attendance must be provided for all students in the class' });
    }

    // Check for existing attendance record (match by date, day, period)
    let existing = cls.attendance.find(
      a => a.date === date &&
        a.day === day &&
        a.period === period
    );

    const formattedAttendances = attendances.map(a => ({
      student: a.studentId,
      status: a.status
    }));

    if (existing) {
      // Update existing record
      existing.studentsAttendance = formattedAttendances;
      existing.subject = schedulePeriod.subject; // Refresh in case schedule changed
      existing.teacher = schedulePeriod.teacher;
    } else {
      // Create new record
      cls.attendance.push({
        date,
        day,
        period,
        subject: schedulePeriod.subject,
        teacher: schedulePeriod.teacher,
        studentsAttendance: formattedAttendances,
        report: ''
      });
    }

    await cls.save();
    res.json({ message: 'Attendance saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAttendanceReport = async (req, res) => {
  try {
    const { classId, date, day, period, report } = req.body;

    // Validate required fields
    if (!classId || !date || !day || !period) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Find existing attendance record
    let existing = cls.attendance.find(
      a => a.date === date &&
        a.day === day &&
        a.period === period
    );

    if (!existing) {
      return res.status(404).json({ message: 'Attendance record not found. Please submit attendance first.' });
    }

    existing.report = report || '';

    await cls.save();
    res.json({ message: 'Report updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get attendance for a class (optionally filtered by date, day, period)
exports.getAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date, day, period } = req.query;

    const cls = await Class.findById(classId)
      .select('attendance')
      .populate({
        path: 'attendance.studentsAttendance.student',
        select: 'first_name last_name national_code'
      })
      .populate({
        path: 'attendance.teacher',
        select: 'first_name last_name mobile'
      });

    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    let filteredAttendance = cls.attendance || [];

    if (date) {
      filteredAttendance = filteredAttendance.filter(a => a.date === date);
    }

    if (day) {
      filteredAttendance = filteredAttendance.filter(a => a.day === day.toLowerCase());
    }

    if (period) {
      filteredAttendance = filteredAttendance.filter(a => a.period === parseInt(period, 10));
    }

    res.json(filteredAttendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Find classes with attendance records for the given date
    const classes = await Class.find({ "attendance.date": date })
      .populate("attendance.teacher")
      .populate("attendance.studentsAttendance.student");

    // Format response
    const result = classes.map(cls => ({
      className: cls.name,
      attendance: cls.attendance.filter(a => a.date === date)
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get missing attendance records for a specific date across all classes
exports.getMissingAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'Invalid date format (use YYYY-MM-DD)' });
    }

    // Compute day of week from date
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayIndex = new Date(date).getDay();
    const dayName = daysOfWeek[dayIndex];

    console.log(dayName);

    const classes = await Class.find({})
      .populate({
        path: 'days.saturday.teacher days.sunday.teacher days.monday.teacher days.tuesday.teacher days.wednesday.teacher days.thursday.teacher days.friday.teacher',
        select: 'first_name last_name mobile'
      });

    let missingAttendances = [];

    for (let cls of classes) {
      const schedule = cls.days[dayName] || [];
      for (let period = 1; period <= schedule.length; period++) {
        const periodObj = schedule[period - 1];
        if (!periodObj || !periodObj.teacher) continue; // Skip empty periods

        // Check if attendance exists for this date, day, period
        const existingAttendance = cls.attendance.find(
          a => a.date === date && a.day === dayName && a.period === period
        );

        if (!existingAttendance) {
          missingAttendances.push({
            classId: cls._id,
            className: cls.name,
            date,
            day: dayName,
            period,
            subject: periodObj.subject,
            teacherId: periodObj.teacher._id,
            teacherName: `${periodObj.teacher.first_name} ${periodObj.teacher.last_name}`,
            teacherMobile: periodObj.teacher.mobile
          });
        }
      }
    }

    res.json(missingAttendances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update attendance by disciplinary deputy (edit studentsAttendance and report if not confirmed)
exports.updateAttendanceByDeputy = async (req, res) => {
  try {
    const { className, date, day, period, attendances, report } = req.body;

    // Validate required fields
    if (!className || !date || !day || !period || !attendances || !Array.isArray(attendances)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cls = await Class.findOne({ name: className });
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Find existing attendance record
    let existing = cls.attendance.find(
      a => a.date === date &&
        a.day === day &&
        a.period === period
    );

    if (!existing) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (existing.confirmedBy.disciplinaryDeputy) {
      return res.status(403).json({ message: 'Attendance already confirmed by disciplinary deputy, cannot edit' });
    }

    // Validate day and period exist in schedule (optional, but good to have)
    if (!cls.days[day] || cls.days[day].length < period || period < 1) {
      return res.status(400).json({ message: 'Invalid day or period for this class' });
    }

    // Optional: Validate that attendances cover all students in the class
    const classStudentIds = cls.students.map(s => s.toString());
    const providedStudentIds = attendances.map(a => a.studentId.toString());
    if (classStudentIds.length !== providedStudentIds.length || !classStudentIds.every(id => providedStudentIds.includes(id))) {
      return res.status(400).json({ message: 'Attendance must be provided for all students in the class' });
    }

    const formattedAttendances = attendances.map(a => ({
      student: a.studentId,
      status: a.status
    }));

    // Update record
    existing.studentsAttendance = formattedAttendances;
    existing.report = report !== undefined ? report : existing.report;

    await cls.save();
    res.json({ message: 'Attendance updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Confirm by disciplinary deputy
exports.confirmByDisciplinaryDeputy = async (req, res) => {
  try {
    const { className, date, day, period } = req.body;

    if (!className || !date || !day || !period) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cls = await Class.findOne({ name: className });
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    let existing = cls.attendance.find(
      a => a.date === date &&
        a.day === day &&
        a.period === period
    );

    if (!existing) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    existing.confirmedBy.disciplinaryDeputy = true;

    await cls.save();
    res.json({ message: 'Confirmed by disciplinary deputy successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Confirm by principal
exports.confirmByPrincipal = async (req, res) => {
  try {
    const { className, date, day, period } = req.body;

    if (!className || !date || !day || !period) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cls = await Class.findOne({ name: className });
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    let existing = cls.attendance.find(
      a => a.date === date &&
        a.day === day &&
        a.period === period
    );

    if (!existing) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    existing.confirmedBy.principal = true;

    await cls.save();
    res.json({ message: 'Confirmed by principal successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
