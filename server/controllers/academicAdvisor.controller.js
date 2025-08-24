const AcademicAdvisor = require('../models/academicAdvisor.model');

// Get form data for a student (if exists)
exports.getFormForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const form = await AcademicAdvisor.findOne({ studentId });
    if (!form) {
      return res.status(200).json({
        message: 'No form found for this student',
        form: null,
        exists: false,
      });
    }

    res.status(200).json({
      form,
      exists: true,
      locked: form.locked || false,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit or update form for a student
exports.submitForm = async (req, res) => {
  try {
    const { studentId } = req.params;
    const formData = req.body;

    // Find existing form
    let form = await AcademicAdvisor.findOne({ studentId });

    if (form && form.locked) {
      return res.status(403).json({ message: 'Form is already submitted and locked' });
    }

    formData.advisorDecision = formData.advisorDecision === 'پذیرش';

    if (form) {
      // Update existing form
      Object.assign(form, formData);
      form.locked = true;
      await form.save();
      res.status(200).json({ message: 'Form updated and locked successfully', form });
    } else {
      // Create new form
      form = new AcademicAdvisor({
        studentId,
        ...formData,
        locked: true,
      });
      await form.save();
      res.status(201).json({ message: 'Form submitted and locked successfully', form });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};