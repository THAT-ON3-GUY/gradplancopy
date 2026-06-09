const express = require('express');
const { getDb } = require('../db/seed');

const router = express.Router();

// GET /api/courses — all courses, optional ?department= filter
router.get('/', (req, res) => {
  const db = getDb();
  const { department, q } = req.query;
  let query = 'SELECT * FROM courses';
  const params = [];

  const conditions = [];
  if (department) {
    conditions.push('department = ?');
    params.push(department);
  }
  if (q) {
    conditions.push('(LOWER(code) LIKE ? OR LOWER(name) LIKE ?)');
    params.push(`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`);
  }
  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY department, code';

  const courses = db.prepare(query).all(...params);
  res.json(courses.map(parseCourse));
});

// GET /api/courses/departments
router.get('/departments', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT DISTINCT department FROM courses ORDER BY department').all();
  res.json(rows.map((r) => r.department));
});

// GET /api/courses/:id
router.get('/:id', (req, res) => {
  const db = getDb();
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(parseCourse(course));
});

function parseCourse(c) {
  return {
    ...c,
    prerequisites: JSON.parse(c.prerequisites || '[]'),
    offered: JSON.parse(c.offered || '["Fall","Winter","Spring"]'),
  };
}

module.exports = router;
