const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'grad_planner.db');
let _db = null;

// ── Thin synchronous wrapper mimicking better-sqlite3 ────────────────────────
class DB {
  constructor(sqlDb) {
    this._db = sqlDb;
    this._inTx = false;
  }

  _persist() {
    const data = this._db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }

  // For multi-statement DDL
  exec(sql) {
    this._db.exec(sql);
  }

  prepare(sql) {
    const self = this;
    return {
      run(...params) {
        const stmt = self._db.prepare(sql);
        stmt.bind(params);
        stmt.step();
        stmt.free();
        // Use prepare+step to get lastInsertRowid (avoids exec inside tx)
        const idStmt = self._db.prepare('SELECT last_insert_rowid() as id');
        let lastId = 0;
        if (idStmt.step()) lastId = idStmt.getAsObject().id || 0;
        idStmt.free();
        if (!self._inTx) self._persist();
        return { lastInsertRowid: lastId };
      },
      get(...params) {
        const stmt = self._db.prepare(sql);
        stmt.bind(params);
        let result;
        if (stmt.step()) result = stmt.getAsObject();
        stmt.free();
        return result;
      },
      all(...params) {
        const stmt = self._db.prepare(sql);
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) rows.push(stmt.getAsObject());
        stmt.free();
        return rows;
      },
    };
  }

  transaction(fn) {
    const self = this;
    return function () {
      self._db.run('BEGIN');
      self._inTx = true;
      try {
        fn();
        self._db.run('COMMIT');
        self._inTx = false;
        self._persist();
      } catch (e) {
        self._inTx = false;
        try { self._db.run('ROLLBACK'); } catch (_) {}
        throw e;
      }
    };
  }
}

function getDb() {
  return _db;
}

async function initDb() {
  const SQL = await initSqlJs();

  let sqlDb;
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    sqlDb = new SQL.Database(fileBuffer);
  } else {
    sqlDb = new SQL.Database();
  }

  _db = new DB(sqlDb);

  _db.exec(`
    CREATE TABLE IF NOT EXISTS majors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      total_credits INTEGER NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      credits INTEGER NOT NULL,
      department TEXT NOT NULL,
      description TEXT,
      prerequisites TEXT DEFAULT '[]',
      offered TEXT DEFAULT '["Fall","Winter","Spring"]'
    );

    CREATE TABLE IF NOT EXISTS requirements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      major_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      course_id INTEGER,
      required_credits INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      major_id INTEGER NOT NULL,
      student_name TEXT DEFAULT 'Student',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS plan_courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      semester_year INTEGER NOT NULL,
      semester_term TEXT NOT NULL
    );
  `);

  const majorCount = _db.prepare('SELECT COUNT(*) as c FROM majors').get().c;
  if (majorCount > 0) {
    console.log('Database already seeded.');
    return;
  }

  const insertMajor = _db.prepare(
    'INSERT INTO majors (name, total_credits, description) VALUES (?, ?, ?)'
  );
  const insertCourse = _db.prepare(
    'INSERT OR IGNORE INTO courses (code, name, credits, department, description, prerequisites, offered) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const insertReq = _db.prepare(
    'INSERT INTO requirements (major_id, category, course_id, required_credits) VALUES (?, ?, ?, ?)'
  );

  const seedAll = _db.transaction(() => {
    // ── Majors ──────────────────────────────────────────────────────────────
    const csMajorId = insertMajor.run(
      'Computer Science', 120,
      'A rigorous program covering software engineering, algorithms, and systems.'
    ).lastInsertRowid;

    insertMajor.run('Business Management', 120, 'Prepares students for leadership roles in business and organizations.');
    insertMajor.run('Elementary Education', 120, 'Prepares students to teach in K-6 classrooms.');

    // ── Courses ──────────────────────────────────────────────────────────────
    const C = (code, name, credits, dept, desc, prereqs = '[]', offered = '["Fall","Winter","Spring"]') =>
      insertCourse.run(code, name, credits, dept, desc, prereqs, offered);

    // Religion
    C('FDREL 121', 'The Book of Mormon', 2, 'Religion', 'Study of the Book of Mormon as scripture and its teachings.');
    C('FDREL 122', 'Doctrine and Covenants', 2, 'Religion', 'Study of the Doctrine and Covenants and Church history.');
    C('FDREL 211', 'New Testament', 2, 'Religion', 'Study of the New Testament with an emphasis on the life of Christ.');
    C('FDREL 212', 'Old Testament', 2, 'Religion', 'Survey of the Old Testament and its gospel themes.');
    C('FDREL 325', 'Teachings of Living Prophets', 2, 'Religion', 'Study of modern prophetic teachings and their application.');
    C('FDREL 360', 'The Eternal Family', 2, 'Religion', 'LDS doctrines and principles relating to the eternal family.');

    // Gen Ed
    C('ENGL 101', 'Writing and Reasoning', 3, 'English', 'Develop college-level writing and critical thinking skills.');
    C('ENGL 201', 'Advanced Writing', 3, 'English', 'Advanced composition with emphasis on research and argument.', '["ENGL 101"]');
    C('COMM 101', 'Foundations of Communication', 3, 'Communication', 'Introduction to oral communication and public speaking.');
    C('HIST 101', 'World History I', 3, 'History', 'Survey of world history from ancient times to 1500.', '[]', '["Fall","Winter"]');
    C('POLS 150', 'American Government', 3, 'Political Science', 'Principles and structure of the U.S. government.');

    // Math
    C('MATH 108', 'Pre-Calculus Algebra', 3, 'Math', 'Algebraic concepts and functions in preparation for calculus.');
    C('MATH 109', 'Pre-Calculus Trigonometry', 3, 'Math', 'Trigonometric functions and identities.', '["MATH 108"]');
    C('MATH 110', 'Calculus I', 4, 'Math', 'Limits, derivatives, and integrals of single-variable functions.', '["MATH 109"]');
    C('MATH 215', 'Calculus II', 4, 'Math', 'Integration techniques, sequences, and series.', '["MATH 110"]');
    C('MATH 221', 'Linear Algebra', 3, 'Math', 'Vectors, matrices, and linear transformations.', '["MATH 110"]', '["Fall","Winter"]');
    C('MATH 325', 'Probability and Statistics', 3, 'Math', 'Probability theory, distributions, and statistical inference.', '["MATH 110"]');

    // Physics
    C('PHYS 121', 'Foundations of Physics I', 4, 'Physics', 'Mechanics, energy, and thermodynamics.', '["MATH 110"]', '["Fall","Winter"]');
    C('PHYS 122', 'Foundations of Physics II', 4, 'Physics', 'Electricity, magnetism, and optics.', '["PHYS 121"]', '["Winter","Spring"]');

    // CS Core
    C('CS 101',  'Computing Foundations', 1, 'CS', 'Introduction to computing concepts and the BYUI CS program.');
    C('CS 111',  'Introduction to CS Principles', 2, 'CS', 'Broad introduction to computational thinking and programming.');
    C('CS 112',  'Programming with Functions', 2, 'CS', 'Functions, recursion, and procedural programming in Python.', '["CS 111"]');
    C('CS 165',  'Object-Oriented Software Dev', 3, 'CS', 'Classes, inheritance, polymorphism, and OOP design patterns.', '["CS 112"]');
    C('CS 212',  'Software Engineering', 3, 'CS', 'Software development life cycle, version control, and team practices.', '["CS 165"]', '["Fall","Winter"]');
    C('CS 241',  'Algorithms and Complexity', 3, 'CS', 'Algorithm design, analysis, and complexity theory.', '["CS 165","MATH 221"]', '["Fall","Winter"]');
    C('CS 246',  'Software Design and Dev', 2, 'CS', 'Design patterns, SOLID principles, and software architecture.', '["CS 212"]');
    C('CS 265',  'Web Frontend Development', 3, 'CS', 'HTML, CSS, JavaScript, and modern frontend frameworks.', '["CS 165"]');
    C('CS 306',  'Ethical Foundations of CS', 2, 'CS', 'Ethics, privacy, and societal impacts of computing.', '["CS 165"]');
    C('CS 313',  'Discrete Mathematics', 3, 'CS', 'Sets, logic, proofs, graph theory, and combinatorics.', '["MATH 110"]', '["Fall","Winter"]');
    C('CS 345',  'Operating Systems', 3, 'CS', 'Processes, memory management, file systems, and concurrency.', '["CS 241"]', '["Fall","Winter"]');
    C('CS 364',  'Software Engineering II', 3, 'CS', 'Advanced software engineering: testing, CI/CD, and agile methods.', '["CS 246"]', '["Fall","Winter"]');
    C('CS 371',  'Database Design', 2, 'CS', 'Relational database design, SQL, normalization, and NoSQL.', '["CS 246"]');
    C('CS 405',  'Computer Networks', 3, 'CS', 'Network protocols, TCP/IP, security, and distributed systems.', '["CS 345"]', '["Fall","Winter"]');
    C('CS 450',  'Artificial Intelligence', 3, 'CS', 'Search, machine learning, neural networks, and NLP fundamentals.', '["CS 241","MATH 325"]', '["Fall","Winter"]');
    C('CS 460',  'Computer Graphics', 3, 'CS', 'Rendering pipelines, shaders, 3D transformations, and WebGL.', '["CS 241","MATH 221"]', '["Winter","Spring"]');
    C('CS 499',  'Senior Project', 3, 'CS', 'Capstone project demonstrating mastery of CS skills.', '["CS 364","CS 371"]');

    // ── Requirements for CS major ─────────────────────────────────────────────
    const getCourseId = (code) =>
      _db.prepare('SELECT id FROM courses WHERE code = ?').get(code)?.id;

    for (const code of ['CS 101','CS 111','CS 112','CS 165','CS 212','CS 241','CS 246','CS 306','CS 313','CS 345','CS 364','CS 371','CS 450','CS 499']) {
      const cid = getCourseId(code);
      if (cid) insertReq.run(csMajorId, 'CS Core', cid, 0);
    }
    for (const code of ['MATH 110','MATH 215','MATH 221','MATH 325','PHYS 121','PHYS 122']) {
      const cid = getCourseId(code);
      if (cid) insertReq.run(csMajorId, 'Math/Science', cid, 0);
    }
    for (const code of ['FDREL 121','FDREL 122','FDREL 211','FDREL 212','FDREL 325','FDREL 360']) {
      const cid = getCourseId(code);
      if (cid) insertReq.run(csMajorId, 'Religion', cid, 0);
    }
    for (const code of ['ENGL 101','ENGL 201','COMM 101']) {
      const cid = getCourseId(code);
      if (cid) insertReq.run(csMajorId, 'Gen Ed', cid, 0);
    }
    insertReq.run(csMajorId, 'CS Electives', null, 6);

    // ── Default plan ──────────────────────────────────────────────────────────
    const planId = _db.prepare(
      'INSERT INTO plans (name, major_id, student_name) VALUES (?, ?, ?)'
    ).run('My Graduation Plan', csMajorId, 'Student').lastInsertRowid;

    const addCourse = _db.prepare(
      'INSERT INTO plan_courses (plan_id, course_id, semester_year, semester_term) VALUES (?, ?, ?, ?)'
    );
    const place = (code, year, term) => {
      const cid = getCourseId(code);
      if (cid) addCourse.run(planId, cid, year, term);
    };

    place('CS 101',    2024, 'Fall');   place('CS 111',    2024, 'Fall');
    place('ENGL 101',  2024, 'Fall');   place('FDREL 121', 2024, 'Fall');
    place('MATH 108',  2024, 'Fall');

    place('CS 112',    2025, 'Winter'); place('ENGL 201',  2025, 'Winter');
    place('FDREL 122', 2025, 'Winter'); place('MATH 109',  2025, 'Winter');

    place('CS 165',    2025, 'Spring'); place('COMM 101',  2025, 'Spring');
    place('FDREL 211', 2025, 'Spring'); place('MATH 110',  2025, 'Spring');

    place('CS 212',    2025, 'Fall');   place('CS 313',    2025, 'Fall');
    place('FDREL 212', 2025, 'Fall');   place('MATH 215',  2025, 'Fall');
    place('PHYS 121',  2025, 'Fall');

    place('CS 241',    2026, 'Winter'); place('CS 246',    2026, 'Winter');
    place('MATH 221',  2026, 'Winter'); place('PHYS 122',  2026, 'Winter');

    place('CS 265',    2026, 'Spring'); place('CS 306',    2026, 'Spring');
    place('FDREL 325', 2026, 'Spring'); place('MATH 325',  2026, 'Spring');

    place('CS 345',    2026, 'Fall');   place('CS 364',    2026, 'Fall');
    place('CS 371',    2026, 'Fall');   place('FDREL 360', 2026, 'Fall');

    place('CS 405',    2027, 'Winter'); place('CS 450',    2027, 'Winter');
    place('CS 460',    2027, 'Spring');
    place('CS 499',    2027, 'Fall');
  });

  seedAll();
  console.log('Database seeded successfully.');
}

module.exports = { getDb, initDb };
