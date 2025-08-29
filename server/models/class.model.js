const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., 11A
    level: { type: String, enum: ['10', '11', '12'], required: true },
    // timetable: each day → subjects → teacher
    days: {
      saturday: [
        {
          subject: { type: String, required: true },
          teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
        }
      ],
      sunday: [
        {
          subject: { type: String, required: true },
          teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
        }
      ],
      monday: [
        {
          subject: { type: String, required: true },
          teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
        }
      ],
      tuesday: [
        {
          subject: { type: String, required: true },
          teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
        }
      ],
      wednesday: [
        {
          subject: { type: String, required: true },
          teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
        }
      ],
      thursday: [
        {
          subject: { type: String, required: true },
          teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
        }
      ],
      friday: [
        {
          subject: { type: String, required: true },
          teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
        }
      ],
    },

    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);