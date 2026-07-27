const pool = require("../config/db");

// Get Courses
exports.getCourses = async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM courses ORDER BY id"
        );

        res.json(result.rows);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};

// Add Course
exports.addCourse = async (req, res) => {

    try {

        const { name, capacity } = req.body;

        if (!name || !capacity) {
            return res.status(400).json({
                message: "Course name and capacity are required."
            });
        }

        const exist = await pool.query(
            "SELECT * FROM courses WHERE LOWER(name)=LOWER($1)",
            [name]
        );

        if (exist.rows.length > 0) {
            return res.status(400).json({
                message: "Course already exists."
            });
        }

        await pool.query(
            "INSERT INTO courses(name,capacity) VALUES($1,$2)",
            [name, capacity]
        );

        res.status(201).json({
            message: "Course Added Successfully."
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// Update Course
exports.updateCourse = async (req, res) => {

    try {

        const { id } = req.params;
        const { name, capacity } = req.body;

        await pool.query(
            "UPDATE courses SET name=$1, capacity=$2 WHERE id=$3",
            [name, capacity, id]
        );

        res.json({
            message: "Course Updated Successfully."
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// Delete Course
exports.deleteCourse = async (req, res) => {

    try {

        const { id } = req.params;

        // Check enrolled students
        const student = await pool.query(
            "SELECT COUNT(*) FROM students WHERE course_id=$1",
            [id]
        );

        if (Number(student.rows[0].count) > 0) {
            return res.status(400).json({
                message: "Cannot delete. Students are enrolled in this course."
            });
        }

        await pool.query(
            "DELETE FROM courses WHERE id=$1",
            [id]
        );

        res.json({
            message: "Course Deleted Successfully."
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};