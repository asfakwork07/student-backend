const pool = require("../config/db");

// Create Student
exports.createStudent = async (req, res) => {
  try {
    const { fullname, email, dob, course_id } = req.body;

    if (!fullname || !email || !dob || !course_id) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Email already exists
    const emailExist = await pool.query(
      "SELECT * FROM students WHERE email=$1",
      [email],
    );

    if (emailExist.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    // Age Validation
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 16) {
      return res.status(400).json({
        message: "Student must be at least 16 years old.",
      });
    }

    // Check Course
    const course = await pool.query(
      "SELECT capacity FROM courses WHERE id=$1",
      [course_id],
    );

    if (course.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    const capacity = course.rows[0].capacity;

    const totalStudent = await pool.query(
      "SELECT COUNT(*) FROM students WHERE course_id=$1",
      [course_id],
    );

    if (Number(totalStudent.rows[0].count) >= capacity) {
      return res.status(400).json({
        message: "No seats available.",
      });
    }

    await pool.query(
      "INSERT INTO students(fullname,email,dob,course_id) VALUES($1,$2,$3,$4)",
      [fullname, email, dob, course_id],
    );

    res.status(201).json({
      message: "Student Registered Successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Students
exports.getStudents = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT students.id,
                   fullname,
                   email,
                   dob,
                   courses.name AS course
            FROM students
            LEFT JOIN courses
            ON students.course_id = courses.id
            ORDER BY students.id
        `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Student Course

exports.updateStudentCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { course_id } = req.body;

    const course = await pool.query(
      "SELECT capacity FROM courses WHERE id=$1",
      [course_id],
    );

    if (course.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    const capacity = course.rows[0].capacity;

    const total = await pool.query(
      "SELECT COUNT(*) FROM students WHERE course_id=$1",
      [course_id],
    );

    if (Number(total.rows[0].count) >= capacity) {
      return res.status(400).json({
        message: "No seats available.",
      });
    }

    await pool.query("UPDATE students SET course_id=$1 WHERE id=$2", [
      course_id,
      id,
    ]);

    res.json({
      message: "Course Updated Successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM students WHERE id=$1", [id]);

    res.json({
      message: "Student Deleted Successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
