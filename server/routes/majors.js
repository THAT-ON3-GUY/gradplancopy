const express = require('express');
const { getDb } = require('../db/seed');

const router = express.Router();

// GET /api/majors
router.get('/', (req, res) => {
  const db = getDb();
  const majors = db.prepare('SELECT * FROM majors ORDER BY name').all();
  res.json(majors);
});

// GET /api/majors/:id/requirements
router.get('/:id/requirements', (req, res) => {
  const db = getDb();
  const reqs = db
    .prepare(
      `SELECT r.*, c.code, c.name as course_name, c.credits, c.department,
              c.description, c.prerequisites, c.offered, c.is_variable_credit
       FROM requirements r
       LEFT JOIN courses c ON r.course_id = c.id
       WHERE r.major_id = ?
       ORDER BY r.category, r.is_or_option, c.code`
    )
    .all(req.params.id);

  // Group by category
  const grouped = {};
  for (const r of reqs) {
    if (!grouped[r.category]) {
      grouped[r.category] = {
        category: r.category,
        courses: [],
        or_options: [],
        required_credits: 0,
      };
    }
    if (r.course_id) {
      const courseObj = {
        id: r.course_id,
        code: r.code,
        name: r.course_name,
        credits: r.credits,
        department: r.department,
        description: r.description,
        prerequisites: JSON.parse(r.prerequisites || '[]'),
        offered: JSON.parse(r.offered || '[]'),
        is_variable_credit: r.is_variable_credit === 1,
        req_id: r.id,
        is_or_option: r.is_or_option === 1,
      };
      if (r.is_or_option === 1) {
        grouped[r.category].or_options.push(courseObj);
      } else {
        grouped[r.category].courses.push(courseObj);
      }
    } else {
      grouped[r.category].required_credits = r.required_credits;
    }
  }

  res.json(Object.values(grouped));
});

module.exports = router;
