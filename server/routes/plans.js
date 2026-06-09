const express = require('express');
const { getDb } = require('../db/seed');

const router = express.Router();

// GET /api/plans — list all plans
router.get('/', (req, res) => {
  const db = getDb();
  const plans = db
    .prepare('SELECT p.*, m.name as major_name FROM plans p JOIN majors m ON p.major_id = m.id ORDER BY p.id DESC')
    .all();
  res.json(plans);
});

// POST /api/plans — create a plan
router.post('/', (req, res) => {
  const db = getDb();
  const { name, major_id, student_name } = req.body;
  if (!name || !major_id) return res.status(400).json({ error: 'name and major_id required' });
  const result = db
    .prepare('INSERT INTO plans (name, major_id, student_name) VALUES (?, ?, ?)')
    .run(name, major_id, student_name || 'Student');
  const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(plan);
});

// GET /api/plans/:id/courses — all courses in a plan with full course details
router.get('/:id/courses', (req, res) => {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT pc.id as plan_course_id, pc.semester_year, pc.semester_term,
              c.id as course_id, c.code, c.name, c.credits, c.department, c.description,
              c.prerequisites, c.offered
       FROM plan_courses pc
       JOIN courses c ON pc.course_id = c.id
       WHERE pc.plan_id = ?
       ORDER BY pc.semester_year, CASE pc.semester_term WHEN 'Fall' THEN 1 WHEN 'Winter' THEN 2 ELSE 3 END, c.code`
    )
    .all(req.params.id);

  res.json(
    rows.map((r) => ({
      plan_course_id: r.plan_course_id,
      semester_year: r.semester_year,
      semester_term: r.semester_term,
      course: {
        id: r.course_id,
        code: r.code,
        name: r.name,
        credits: r.credits,
        department: r.department,
        description: r.description,
        prerequisites: JSON.parse(r.prerequisites || '[]'),
        offered: JSON.parse(r.offered || '[]'),
      },
    }))
  );
});

// POST /api/plans/:id/courses — add a course to a plan
router.post('/:id/courses', (req, res) => {
  const db = getDb();
  const { course_id, semester_year, semester_term } = req.body;
  if (!course_id || !semester_year || !semester_term)
    return res.status(400).json({ error: 'course_id, semester_year, and semester_term required' });

  // Prevent duplicates in same plan
  const exists = db
    .prepare('SELECT id FROM plan_courses WHERE plan_id = ? AND course_id = ?')
    .get(req.params.id, course_id);
  if (exists) return res.status(409).json({ error: 'Course already in this plan' });

  const result = db
    .prepare('INSERT INTO plan_courses (plan_id, course_id, semester_year, semester_term) VALUES (?, ?, ?, ?)')
    .run(req.params.id, course_id, semester_year, semester_term);

  res.status(201).json({ plan_course_id: result.lastInsertRowid });
});

// PATCH /api/plans/:id/courses/:pcId — move course to different semester
router.patch('/:id/courses/:pcId', (req, res) => {
  const db = getDb();
  const { semester_year, semester_term } = req.body;
  if (!semester_year || !semester_term)
    return res.status(400).json({ error: 'semester_year and semester_term required' });

  db.prepare(
    'UPDATE plan_courses SET semester_year = ?, semester_term = ? WHERE id = ? AND plan_id = ?'
  ).run(semester_year, semester_term, req.params.pcId, req.params.id);

  res.json({ ok: true });
});

// DELETE /api/plans/:id/courses/:pcId — remove a course from a plan
router.delete('/:id/courses/:pcId', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM plan_courses WHERE id = ? AND plan_id = ?').run(
    req.params.pcId,
    req.params.id
  );
  res.json({ ok: true });
});

// GET /api/plans/:id/validate — check prereqs and credit requirements
router.get('/:id/validate', (req, res) => {
  const db = getDb();
  const planCourses = db
    .prepare(
      `SELECT pc.semester_year, pc.semester_term, c.code, c.prerequisites
       FROM plan_courses pc JOIN courses c ON pc.course_id = c.id
       WHERE pc.plan_id = ?`
    )
    .all(req.params.id);

  const termOrder = { Fall: 1, Winter: 2, Spring: 3 };
  const semKey = (year, term) => year * 10 + termOrder[term];

  const issues = [];
  for (const pc of planCourses) {
    const prereqs = JSON.parse(pc.prerequisites || '[]');
    for (const prereqCode of prereqs) {
      const prereq = planCourses.find((p) => p.code === prereqCode);
      if (!prereq) {
        issues.push({ code: pc.code, issue: `Prerequisite ${prereqCode} is not in your plan.` });
      } else if (semKey(prereq.semester_year, prereq.semester_term) >= semKey(pc.semester_year, pc.semester_term)) {
        issues.push({
          code: pc.code,
          issue: `${prereqCode} must be taken before ${pc.code} (currently in same or later semester).`,
        });
      }
    }
  }

  res.json({ valid: issues.length === 0, issues });
});

module.exports = router;
