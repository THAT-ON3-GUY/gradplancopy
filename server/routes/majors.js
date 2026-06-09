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
      `SELECT r.*, c.code, c.name as course_name, c.credits, c.department
       FROM requirements r
       LEFT JOIN courses c ON r.course_id = c.id
       WHERE r.major_id = ?
       ORDER BY r.category, c.code`
    )
    .all(req.params.id);

  // Group by category
  const grouped = {};
  for (const r of reqs) {
    if (!grouped[r.category]) grouped[r.category] = { category: r.category, courses: [], required_credits: 0 };
    if (r.course_id) {
      grouped[r.category].courses.push({
        id: r.course_id,
        code: r.code,
        name: r.course_name,
        credits: r.credits,
        department: r.department,
        req_id: r.id,
      });
    } else {
      grouped[r.category].required_credits = r.required_credits;
    }
  }

  res.json(Object.values(grouped));
});

module.exports = router;
