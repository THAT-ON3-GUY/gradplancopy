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
      offered TEXT DEFAULT '["Fall","Winter","Spring"]',
      is_variable_credit INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS requirements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      major_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      course_id INTEGER,
      required_credits INTEGER DEFAULT 0,
      is_or_option INTEGER DEFAULT 0
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
      semester_term TEXT NOT NULL,
      planned_credits INTEGER
    );

    CREATE TABLE IF NOT EXISTS transfer_credits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      equivalent_code TEXT,
      credits INTEGER NOT NULL,
      institution TEXT DEFAULT 'Transfer Institution'
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
    'INSERT OR IGNORE INTO courses (code, name, credits, department, description, prerequisites, offered, is_variable_credit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const insertReq = _db.prepare(
    'INSERT INTO requirements (major_id, category, course_id, required_credits, is_or_option) VALUES (?, ?, ?, ?, ?)'
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
    // C(code, name, credits, dept, desc, prereqs, offered, isVariable)
    const C = (code, name, credits, dept, desc, prereqs = '[]', offered = '["Fall","Winter","Spring"]', isVar = 0) =>
      insertCourse.run(code, name, credits, dept, desc, prereqs, offered, isVar);

    // Religion
    C('FDREL 121', 'The Book of Mormon', 2, 'Religion', 'Study of the Book of Mormon as scripture and its teachings. Focuses on Nephite history and the words of Christ.');
    C('FDREL 122', 'Doctrine and Covenants', 2, 'Religion', 'Study of the Doctrine and Covenants and Church history. Covers revelations given to Joseph Smith and other latter-day prophets.');
    C('FDREL 211', 'New Testament', 2, 'Religion', 'Study of the New Testament with an emphasis on the life and ministry of Jesus Christ.');
    C('FDREL 212', 'Old Testament', 2, 'Religion', 'Survey of the Old Testament and its gospel themes, including the law, the prophets, and the writings.');
    C('FDREL 325', 'Teachings of Living Prophets', 2, 'Religion', 'Study of modern prophetic teachings and their application to contemporary life.');
    C('FDREL 360', 'The Eternal Family', 2, 'Religion', 'LDS doctrines and principles relating to the eternal family, marriage, and parenting.');
    // OR alternative for FDREL 121 + FDREL 122 combined
    C('FDREL 275C', 'Book of Mormon & Doctrine and Covenants', 4, 'Religion', 'Combined course covering both the Book of Mormon and Doctrine and Covenants. Satisfies both FDREL 121 and FDREL 122 requirements.');

    // Gen Ed
    C('ENGL 101', 'Writing and Reasoning', 3, 'English', 'Develop college-level writing and critical thinking skills. Students will learn to construct arguments, evaluate evidence, and communicate effectively in academic contexts.');
    C('ENGL 201', 'Advanced Writing', 3, 'English', 'Advanced composition with emphasis on research and argument. Prerequisites: ENGL 101.', '["ENGL 101"]');
    C('COMM 101', 'Foundations of Communication', 3, 'Communication', 'Introduction to oral communication, public speaking, and interpersonal communication skills.');
    C('HIST 101', 'World History I', 3, 'History', 'Survey of world history from ancient times to 1500. Covers the development of civilizations, cultures, and empires.', '[]', '["Fall","Winter"]');
    C('POLS 150', 'American Government', 3, 'Political Science', 'Principles and structure of the U.S. government, including the Constitution, branches of government, and civil liberties.');

    // Math
    C('MATH 108', 'Pre-Calculus Algebra', 3, 'Math', 'Algebraic concepts and functions in preparation for calculus. Topics include polynomial, rational, exponential, and logarithmic functions.');
    C('MATH 109', 'Pre-Calculus Trigonometry', 3, 'Math', 'Trigonometric functions and identities, right triangle trigonometry, and the unit circle.', '["MATH 108"]');
    C('MATH 110', 'Calculus I', 4, 'Math', 'Limits, derivatives, and integrals of single-variable functions. Applications to velocity, area, and optimization.', '["MATH 109"]');
    C('MATH 215', 'Calculus II', 4, 'Math', 'Integration techniques, sequences, series, and applications of integration.', '["MATH 110"]');
    C('MATH 221', 'Linear Algebra', 3, 'Math', 'Vectors, matrices, linear transformations, eigenvalues, and eigenvectors with computer science applications.', '["MATH 110"]', '["Fall","Winter"]');
    C('MATH 325', 'Probability and Statistics', 3, 'Math', 'Probability theory, probability distributions, statistical inference, and data analysis techniques.', '["MATH 110"]');

    // Physics
    C('PHYS 121', 'Foundations of Physics I', 4, 'Physics', 'Mechanics, energy, thermodynamics, and wave motion. Algebra and calculus-based approach.', '["MATH 110"]', '["Fall","Winter"]');
    C('PHYS 122', 'Foundations of Physics II', 4, 'Physics', 'Electricity, magnetism, optics, and modern physics. Continuation of PHYS 121.', '["PHYS 121"]', '["Winter","Spring"]');

    // CS Core
    C('CS 101',  'Computing Foundations', 1, 'CS', 'Introduction to computing concepts and the BYUI CS program. Overview of career pathways and professional expectations.');
    C('CS 111',  'Introduction to CS Principles', 2, 'CS', 'Broad introduction to computational thinking, programming concepts, and problem solving using Python.');
    C('CS 112',  'Programming with Functions', 2, 'CS', 'Functions, recursion, and procedural programming in Python. Emphasis on modular design and code reuse.', '["CS 111"]');
    C('CS 165',  'Object-Oriented Software Dev', 3, 'CS', 'Classes, inheritance, polymorphism, and OOP design patterns. Projects in C++ emphasize real-world software engineering.', '["CS 112"]');
    C('CS 212',  'Software Engineering', 3, 'CS', 'Software development life cycle, version control, requirements engineering, and team-based project practices.', '["CS 165"]', '["Fall","Winter"]');
    C('CS 241',  'Algorithms and Complexity', 3, 'CS', 'Algorithm design paradigms including divide-and-conquer, dynamic programming, greedy algorithms, and NP-completeness.', '["CS 165","MATH 221"]', '["Fall","Winter"]');
    C('CS 246',  'Software Design and Dev', 2, 'CS', 'Design patterns, SOLID principles, refactoring, and software architecture. Hands-on application in team projects.', '["CS 212"]');
    C('CS 265',  'Web Frontend Development', 3, 'CS', 'HTML5, CSS3, JavaScript ES6+, and modern frameworks such as React. Responsive design and web accessibility.', '["CS 165"]');
    C('CS 306',  'Ethical Foundations of CS', 2, 'CS', 'Ethics, privacy, intellectual property, and societal impacts of computing technology.', '["CS 165"]');
    C('CS 313',  'Discrete Mathematics', 3, 'CS', 'Sets, logic, proofs, graph theory, combinatorics, and their applications in computing.', '["MATH 110"]', '["Fall","Winter"]');
    C('CS 345',  'Operating Systems', 3, 'CS', 'Processes, threads, memory management, file systems, and concurrency. Hands-on projects in C.', '["CS 241"]', '["Fall","Winter"]');
    C('CS 364',  'Software Engineering II', 3, 'CS', 'Advanced software engineering: automated testing, CI/CD pipelines, DevOps practices, and agile methodologies.', '["CS 246"]', '["Fall","Winter"]');
    C('CS 371',  'Database Design', 2, 'CS', 'Relational database design, SQL, normalization, transactions, and introduction to NoSQL systems.', '["CS 246"]');
    C('CS 398',  'Internship', 3, 'CS', 'Professional internship in a CS-related field. Students gain hands-on industry experience and submit a reflective portfolio. Credit hours vary based on internship scope.', '["CS 212"]', '["Fall","Spring"]', 1);
    C('CS 405',  'Computer Networks', 3, 'CS', 'Network protocols, TCP/IP stack, socket programming, network security, and distributed systems.', '["CS 345"]', '["Fall","Winter"]');
    C('CS 450',  'Artificial Intelligence', 3, 'CS', 'Search algorithms, machine learning fundamentals, neural networks, and natural language processing.', '["CS 241","MATH 325"]', '["Fall","Winter"]');
    C('CS 460',  'Computer Graphics', 3, 'CS', 'Rendering pipelines, shader programming, 3D transformations, ray tracing, and WebGL applications.', '["CS 241","MATH 221"]', '["Winter","Spring"]');
    C('CS 499',  'Senior Project', 3, 'CS', 'Capstone project demonstrating mastery of CS skills. Students work in teams to design, develop, and present a significant software system.', '["CS 364","CS 371"]', '["Fall","Winter","Spring"]', 1);

    // ── Requirements for CS major ─────────────────────────────────────────────
    const getCourseId = (code) =>
      _db.prepare('SELECT id FROM courses WHERE code = ?').get(code)?.id;

    // CS Core (Degree tab)
    for (const code of ['CS 101','CS 111','CS 112','CS 165','CS 212','CS 241','CS 246','CS 306','CS 313','CS 345','CS 364','CS 371','CS 450','CS 499']) {
      const cid = getCourseId(code);
      if (cid) insertReq.run(csMajorId, 'CS Core', cid, 0, 0);
    }
    // Math/Science (Degree tab)
    for (const code of ['MATH 110','MATH 215','MATH 221','MATH 325','PHYS 121','PHYS 122']) {
      const cid = getCourseId(code);
      if (cid) insertReq.run(csMajorId, 'Math/Science', cid, 0, 0);
    }
    // Religion (General tab) — main courses
    for (const code of ['FDREL 121','FDREL 122','FDREL 211','FDREL 212','FDREL 325','FDREL 360']) {
      const cid = getCourseId(code);
      if (cid) insertReq.run(csMajorId, 'Religion', cid, 0, 0);
    }
    // Religion — OR alternative (FDREL 275C replaces FDREL 121 + 122)
    {
      const cid = getCourseId('FDREL 275C');
      if (cid) insertReq.run(csMajorId, 'Religion', cid, 0, 1);
    }
    // Gen Ed (General tab)
    for (const code of ['ENGL 101','ENGL 201','COMM 101']) {
      const cid = getCourseId(code);
      if (cid) insertReq.run(csMajorId, 'Gen Ed', cid, 0, 0);
    }
    // Electives
    insertReq.run(csMajorId, 'CS Electives', null, 6, 0);

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

    // Year 1 — 2024
    place('CS 101',    2024, 'Fall');   place('CS 111',    2024, 'Fall');
    place('ENGL 101',  2024, 'Fall');   place('FDREL 121', 2024, 'Fall');
    place('MATH 108',  2024, 'Fall');

    place('CS 112',    2025, 'Winter'); place('ENGL 201',  2025, 'Winter');
    place('FDREL 122', 2025, 'Winter'); place('MATH 109',  2025, 'Winter');

    place('CS 165',    2025, 'Spring'); place('COMM 101',  2025, 'Spring');
    place('FDREL 211', 2025, 'Spring'); place('MATH 110',  2025, 'Spring');

    // Year 2 — 2025
    place('CS 212',    2025, 'Fall');   place('CS 313',    2025, 'Fall');
    place('FDREL 212', 2025, 'Fall');   place('MATH 215',  2025, 'Fall');
    place('PHYS 121',  2025, 'Fall');

    place('CS 241',    2026, 'Winter'); place('CS 246',    2026, 'Winter');
    place('MATH 221',  2026, 'Winter'); place('PHYS 122',  2026, 'Winter');

    place('CS 265',    2026, 'Spring'); place('CS 306',    2026, 'Spring');
    place('FDREL 325', 2026, 'Spring'); place('MATH 325',  2026, 'Spring');

    // Year 3 — 2026
    place('CS 345',    2026, 'Fall');   place('CS 364',    2026, 'Fall');
    place('CS 371',    2026, 'Fall');   place('FDREL 360', 2026, 'Fall');

    place('CS 405',    2027, 'Winter'); place('CS 450',    2027, 'Winter');
    place('CS 460',    2027, 'Spring'); place('CS 398',    2027, 'Spring');
    place('CS 499',    2027, 'Fall');

    // ── Transfer credits ──────────────────────────────────────────────────────
    const addTransfer = _db.prepare(
      'INSERT INTO transfer_credits (plan_id, name, code, equivalent_code, credits, institution) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const TC = (name, code, equiv, credits, inst = 'Transfer Institution') =>
      addTransfer.run(planId, name, code, equiv, credits, inst);

    TC('Intro. General Chemistry',      'CHEM&139',  'CHEM 139',  5, 'Edmonds Community College');
    TC('Intro to Sociology',            'SOC&101',   'SOC 111',   5, 'Edmonds Community College');
    TC('U.S. History Since 1877',       'HIST&158',  'HIST 121',  5, 'Edmonds Community College');
    TC('American Government',           'POLS&101',  'POLS 150',  5, 'Edmonds Community College');
    TC('Intro to Communication',        'CMST&101',  'COMM 101',  5, 'Edmonds Community College');
    TC('Intro Comp Information Sys',    'CIS 121',   'CIS 121',   5, 'Edmonds Community College');
    TC('Personal & Academic Skills',    'COLLG 115', 'COLLG 115', 5, 'Edmonds Community College');
    TC('English Composition I',         'ENGL&101',  'ENGL 101',  5, 'Edmonds Community College');
    TC('Precalculus I',                 'MATH&141',  'MATH 141',  5, 'Edmonds Community College');
  });

  seedAll();
  console.log('Database seeded successfully.');
}

module.exports = { getDb, initDb };
