// ── Mock API ──────────────────────────────────────────────────────────────────
// Mirrors the real Express/SQLite API but uses in-memory data + localStorage.
// Used when VITE_USE_MOCK=true (e.g. GitHub Pages deployment).

// ── Static seed data ──────────────────────────────────────────────────────────

const MAJORS = [
  { id: 1, name: 'Computer Science', total_credits: 120, description: 'A rigorous program covering software engineering, algorithms, and systems.' },
  { id: 2, name: 'Business Management', total_credits: 120, description: 'Prepares students for leadership roles in business and organizations.' },
  { id: 3, name: 'Elementary Education', total_credits: 120, description: 'Prepares students to teach in K-6 classrooms.' },
];

const COURSES = [
  // Religion
  { id: 1,  code: 'FDREL 121', name: 'The Book of Mormon',           credits: 2, department: 'Religion',          description: 'Study of the Book of Mormon as scripture and its teachings.',                                   prerequisites: [],                          offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 2,  code: 'FDREL 122', name: 'Doctrine and Covenants',       credits: 2, department: 'Religion',          description: 'Study of the Doctrine and Covenants and Church history.',                                    prerequisites: [],                          offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 3,  code: 'FDREL 211', name: 'New Testament',                credits: 2, department: 'Religion',          description: 'Study of the New Testament with an emphasis on the life of Christ.',                         prerequisites: [],                          offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 4,  code: 'FDREL 212', name: 'Old Testament',                credits: 2, department: 'Religion',          description: 'Survey of the Old Testament and its gospel themes.',                                         prerequisites: [],                          offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 5,  code: 'FDREL 325', name: 'Teachings of Living Prophets', credits: 2, department: 'Religion',          description: 'Study of modern prophetic teachings and their application.',                                  prerequisites: [],                          offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 6,  code: 'FDREL 360', name: 'The Eternal Family',           credits: 2, department: 'Religion',          description: 'LDS doctrines and principles relating to the eternal family.',                               prerequisites: [],                          offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  // Gen Ed
  { id: 7,  code: 'ENGL 101',  name: 'Writing and Reasoning',        credits: 3, department: 'English',           description: 'Develop college-level writing and critical thinking skills.',                                 prerequisites: [],                          offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 8,  code: 'ENGL 201',  name: 'Advanced Writing',             credits: 3, department: 'English',           description: 'Advanced composition with emphasis on research and argument.',                               prerequisites: ['ENGL 101'],                offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 9,  code: 'COMM 101',  name: 'Foundations of Communication', credits: 3, department: 'Communication',     description: 'Introduction to oral communication and public speaking.',                                    prerequisites: [],                          offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 10, code: 'HIST 101',  name: 'World History I',              credits: 3, department: 'History',           description: 'Survey of world history from ancient times to 1500.',                                        prerequisites: [],                          offered: ['Fall','Winter'],          is_variable_credit: false },
  { id: 11, code: 'POLS 150',  name: 'American Government',          credits: 3, department: 'Political Science', description: 'Principles and structure of the U.S. government.',                                          prerequisites: [],                          offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  // Math
  { id: 12, code: 'MATH 108',  name: 'Pre-Calculus Algebra',         credits: 3, department: 'Math',              description: 'Algebraic concepts and functions in preparation for calculus.',                               prerequisites: [],                          offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 13, code: 'MATH 109',  name: 'Pre-Calculus Trigonometry',    credits: 3, department: 'Math',              description: 'Trigonometric functions and identities.',                                                    prerequisites: ['MATH 108'],                offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 14, code: 'MATH 110',  name: 'Calculus I',                   credits: 4, department: 'Math',              description: 'Limits, derivatives, and integrals of single-variable functions.',                            prerequisites: ['MATH 109'],                offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 15, code: 'MATH 215',  name: 'Calculus II',                  credits: 4, department: 'Math',              description: 'Integration techniques, sequences, and series.',                                             prerequisites: ['MATH 110'],                offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 16, code: 'MATH 221',  name: 'Linear Algebra',               credits: 3, department: 'Math',              description: 'Vectors, matrices, and linear transformations.',                                             prerequisites: ['MATH 110'],                offered: ['Fall','Winter'],          is_variable_credit: false },
  { id: 17, code: 'MATH 325',  name: 'Probability and Statistics',   credits: 3, department: 'Math',              description: 'Probability theory, distributions, and statistical inference.',                               prerequisites: ['MATH 110'],                offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  // Physics
  { id: 18, code: 'PHYS 121',  name: 'Foundations of Physics I',     credits: 4, department: 'Physics',           description: 'Mechanics, energy, and thermodynamics.',                                                    prerequisites: ['MATH 110'],                offered: ['Fall','Winter'],          is_variable_credit: false },
  { id: 19, code: 'PHYS 122',  name: 'Foundations of Physics II',    credits: 4, department: 'Physics',           description: 'Electricity, magnetism, and optics.',                                                       prerequisites: ['PHYS 121'],                offered: ['Winter','Spring'],        is_variable_credit: false },
  // CS Core
  { id: 20, code: 'CS 101',    name: 'Computing Foundations',                credits: 1, department: 'CS', description: 'Introduction to computing concepts and the BYUI CS program.',                                   prerequisites: [],                          offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 21, code: 'CS 111',    name: 'Introduction to CS Principles',         credits: 2, department: 'CS', description: 'Broad introduction to computational thinking and programming.',                                  prerequisites: [],                          offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 22, code: 'CS 112',    name: 'Programming with Functions',            credits: 2, department: 'CS', description: 'Functions, recursion, and procedural programming in Python.',                                   prerequisites: ['CS 111'],                  offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 23, code: 'CS 165',    name: 'Object-Oriented Software Dev',          credits: 3, department: 'CS', description: 'Classes, inheritance, polymorphism, and OOP design patterns.',                                  prerequisites: ['CS 112'],                  offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 24, code: 'CS 212',    name: 'Software Engineering',                  credits: 3, department: 'CS', description: 'Software development life cycle, version control, and team practices.',                         prerequisites: ['CS 165'],                  offered: ['Fall','Winter'],          is_variable_credit: false },
  { id: 25, code: 'CS 241',    name: 'Algorithms and Complexity',             credits: 3, department: 'CS', description: 'Algorithm design, analysis, and complexity theory.',                                            prerequisites: ['CS 165','MATH 221'],       offered: ['Fall','Winter'],          is_variable_credit: false },
  { id: 26, code: 'CS 246',    name: 'Software Design and Dev',               credits: 2, department: 'CS', description: 'Design patterns, SOLID principles, and software architecture.',                                 prerequisites: ['CS 212'],                  offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 27, code: 'CS 265',    name: 'Web Frontend Development',              credits: 3, department: 'CS', description: 'HTML, CSS, JavaScript, and modern frontend frameworks.',                                        prerequisites: ['CS 165'],                  offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 28, code: 'CS 306',    name: 'Ethical Foundations of CS',             credits: 2, department: 'CS', description: 'Ethics, privacy, and societal impacts of computing.',                                           prerequisites: ['CS 165'],                  offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 29, code: 'CS 313',    name: 'Discrete Mathematics',                  credits: 3, department: 'CS', description: 'Sets, logic, proofs, graph theory, and combinatorics.',                                        prerequisites: ['MATH 110'],                offered: ['Fall','Winter'],          is_variable_credit: false },
  { id: 30, code: 'CS 345',    name: 'Operating Systems',                     credits: 3, department: 'CS', description: 'Processes, memory management, file systems, and concurrency.',                                  prerequisites: ['CS 241'],                  offered: ['Fall','Winter'],          is_variable_credit: false },
  { id: 31, code: 'CS 364',    name: 'Software Engineering II',               credits: 3, department: 'CS', description: 'Advanced software engineering: testing, CI/CD, and agile methods.',                             prerequisites: ['CS 246'],                  offered: ['Fall','Winter'],          is_variable_credit: false },
  { id: 32, code: 'CS 371',    name: 'Database Design',                       credits: 2, department: 'CS', description: 'Relational database design, SQL, normalization, and NoSQL.',                                   prerequisites: ['CS 246'],                  offered: ['Fall','Winter','Spring'], is_variable_credit: false },
  { id: 33, code: 'CS 398',    name: 'Internship',                            credits: 3, department: 'CS', description: 'Professional internship providing real-world software development experience.',                  prerequisites: ['CS 246'],                  offered: ['Fall','Winter','Spring'], is_variable_credit: true  },
  { id: 34, code: 'CS 405',    name: 'Computer Networks',                     credits: 3, department: 'CS', description: 'Network protocols, TCP/IP, security, and distributed systems.',                                prerequisites: ['CS 345'],                  offered: ['Fall','Winter'],          is_variable_credit: false },
  { id: 35, code: 'CS 450',    name: 'Artificial Intelligence',               credits: 3, department: 'CS', description: 'Search, machine learning, neural networks, and NLP fundamentals.',                              prerequisites: ['CS 241','MATH 325'],       offered: ['Fall','Winter'],          is_variable_credit: false },
  { id: 36, code: 'CS 460',    name: 'Computer Graphics',                     credits: 3, department: 'CS', description: 'Rendering pipelines, shaders, 3D transformations, and WebGL.',                                 prerequisites: ['CS 241','MATH 221'],       offered: ['Winter','Spring'],        is_variable_credit: false },
  { id: 37, code: 'CS 499',    name: 'Senior Project',                        credits: 3, department: 'CS', description: 'Capstone project demonstrating mastery of CS skills.',                                          prerequisites: ['CS 364','CS 371'],         offered: ['Fall','Winter','Spring'], is_variable_credit: false },
];

const getCourse = (code) => COURSES.find((c) => c.code === code);

// Requirements for CS major (major_id = 1)
const CS_REQUIREMENTS = [
  { category: 'CS Core',     courses: ['CS 101','CS 111','CS 112','CS 165','CS 212','CS 241','CS 246','CS 306','CS 313','CS 345','CS 364','CS 371','CS 450','CS 499'].map(getCourse).filter(Boolean), required_credits: 0 },
  { category: 'Math/Science',courses: ['MATH 110','MATH 215','MATH 221','MATH 325','PHYS 121','PHYS 122'].map(getCourse).filter(Boolean), required_credits: 0 },
  { category: 'Religion',    courses: ['FDREL 121','FDREL 122','FDREL 211','FDREL 212','FDREL 325','FDREL 360'].map(getCourse).filter(Boolean), required_credits: 0 },
  { category: 'Gen Ed',      courses: ['ENGL 101','ENGL 201','COMM 101'].map(getCourse).filter(Boolean), required_credits: 0 },
  { category: 'CS Electives',courses: [], required_credits: 6 },
];

// Default plan courses — matches seed.js placement exactly
const DEFAULT_PLAN_COURSES_RAW = [
  // 2024 Fall
  { course_code: 'CS 101',    year: 2024, term: 'Fall'   },
  { course_code: 'CS 111',    year: 2024, term: 'Fall'   },
  { course_code: 'ENGL 101',  year: 2024, term: 'Fall'   },
  { course_code: 'FDREL 121', year: 2024, term: 'Fall'   },
  { course_code: 'MATH 108',  year: 2024, term: 'Fall'   },
  // 2025 Winter
  { course_code: 'CS 112',    year: 2025, term: 'Winter' },
  { course_code: 'ENGL 201',  year: 2025, term: 'Winter' },
  { course_code: 'FDREL 122', year: 2025, term: 'Winter' },
  { course_code: 'MATH 109',  year: 2025, term: 'Winter' },
  // 2025 Spring
  { course_code: 'CS 165',    year: 2025, term: 'Spring' },
  { course_code: 'COMM 101',  year: 2025, term: 'Spring' },
  { course_code: 'FDREL 211', year: 2025, term: 'Spring' },
  { course_code: 'MATH 110',  year: 2025, term: 'Spring' },
  // 2025 Fall
  { course_code: 'CS 212',    year: 2025, term: 'Fall'   },
  { course_code: 'CS 313',    year: 2025, term: 'Fall'   },
  { course_code: 'FDREL 212', year: 2025, term: 'Fall'   },
  { course_code: 'MATH 215',  year: 2025, term: 'Fall'   },
  { course_code: 'PHYS 121',  year: 2025, term: 'Fall'   },
  // 2026 Winter
  { course_code: 'CS 241',    year: 2026, term: 'Winter' },
  { course_code: 'CS 246',    year: 2026, term: 'Winter' },
  { course_code: 'MATH 221',  year: 2026, term: 'Winter' },
  { course_code: 'PHYS 122',  year: 2026, term: 'Winter' },
  // 2026 Spring
  { course_code: 'CS 265',    year: 2026, term: 'Spring' },
  { course_code: 'CS 306',    year: 2026, term: 'Spring' },
  { course_code: 'FDREL 325', year: 2026, term: 'Spring' },
  { course_code: 'MATH 325',  year: 2026, term: 'Spring' },
  // 2026 Fall
  { course_code: 'CS 345',    year: 2026, term: 'Fall'   },
  { course_code: 'CS 364',    year: 2026, term: 'Fall'   },
  { course_code: 'CS 371',    year: 2026, term: 'Fall'   },
  { course_code: 'FDREL 360', year: 2026, term: 'Fall'   },
  // 2027 Winter
  { course_code: 'CS 405',    year: 2027, term: 'Winter' },
  { course_code: 'CS 450',    year: 2027, term: 'Winter' },
  // 2027 Spring
  { course_code: 'CS 460',    year: 2027, term: 'Spring' },
  { course_code: 'CS 398',    year: 2027, term: 'Spring' },
  // 2027 Fall
  { course_code: 'CS 499',    year: 2027, term: 'Fall'   },
];

const DEFAULT_TRANSFER_CREDITS = [
  { id: 1, plan_id: 1, name: 'Intro. General Chemistry',   code: 'CHEM&139',  equivalent_code: 'CHEM 139',  credits: 5, institution: 'Edmonds Community College' },
  { id: 2, plan_id: 1, name: 'Intro to Sociology',         code: 'SOC&101',   equivalent_code: 'SOC 111',   credits: 5, institution: 'Edmonds Community College' },
  { id: 3, plan_id: 1, name: 'U.S. History Since 1877',    code: 'HIST&158',  equivalent_code: 'HIST 121',  credits: 5, institution: 'Edmonds Community College' },
  { id: 4, plan_id: 1, name: 'American Government',        code: 'POLS&101',  equivalent_code: 'POLS 150',  credits: 5, institution: 'Edmonds Community College' },
  { id: 5, plan_id: 1, name: 'Intro to Communication',     code: 'CMST&101',  equivalent_code: 'COMM 101',  credits: 5, institution: 'Edmonds Community College' },
  { id: 6, plan_id: 1, name: 'Intro Comp Information Sys', code: 'CIS 121',   equivalent_code: 'CIS 121',   credits: 5, institution: 'Edmonds Community College' },
  { id: 7, plan_id: 1, name: 'Personal & Academic Skills', code: 'COLLG 115', equivalent_code: 'COLLG 115', credits: 5, institution: 'Edmonds Community College' },
  { id: 8, plan_id: 1, name: 'English Composition I',      code: 'ENGL&101',  equivalent_code: 'ENGL 101',  credits: 5, institution: 'Edmonds Community College' },
  { id: 9, plan_id: 1, name: 'Precalculus I',              code: 'MATH&141',  equivalent_code: 'MATH 141',  credits: 5, institution: 'Edmonds Community College' },
];

// ── localStorage persistence ──────────────────────────────────────────────────

const LS_COURSES = 'iplan_plan_courses_v2';
const LS_NEXT_ID = 'iplan_next_id_v2';

function buildDefaultRows() {
  return DEFAULT_PLAN_COURSES_RAW.map((r, i) => {
    const course = getCourse(r.course_code);
    return {
      id: i + 1,
      plan_id: 1,
      course_id: course.id,
      semester_year: r.year,
      semester_term: r.term,
      planned_credits: null,
    };
  });
}

function loadRows() {
  try {
    const raw = localStorage.getItem(LS_COURSES);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  const defaults = buildDefaultRows();
  saveRows(defaults);
  return defaults;
}

function saveRows(rows) {
  localStorage.setItem(LS_COURSES, JSON.stringify(rows));
}

function nextId() {
  let n = 0;
  try { n = parseInt(localStorage.getItem(LS_NEXT_ID) || '0', 10); } catch { /* ignore */ }
  const next = n + 1;
  localStorage.setItem(LS_NEXT_ID, String(next));
  return next;
}

function initNextId() {
  try {
    const existing = localStorage.getItem(LS_NEXT_ID);
    if (!existing) {
      localStorage.setItem(LS_NEXT_ID, String(DEFAULT_PLAN_COURSES_RAW.length));
    }
  } catch { /* ignore */ }
}

initNextId();

// Build plan_course response row (matches real API shape)
function toApiRow(row) {
  const course = COURSES.find((c) => c.id === row.course_id);
  if (!course) return null;
  return {
    plan_course_id: row.id,
    semester_year: row.semester_year,
    semester_term: row.semester_term,
    planned_credits: row.planned_credits,
    course,
  };
}

// ── Exported mock API functions ───────────────────────────────────────────────

export async function getMajors() {
  return MAJORS;
}

export async function getCourses() {
  return COURSES;
}

export async function getRequirements(majorId) {
  if (parseInt(majorId) === 1) return CS_REQUIREMENTS;
  return [];
}

export async function getPlans() {
  return [{ id: 1, name: 'My Graduation Plan', major_id: 1, student_name: 'Student', created_at: '2024-09-01', major_name: 'Computer Science' }];
}

export async function createPlan(name, majorId) {
  return { id: 1, name, major_id: parseInt(majorId), student_name: 'Student', created_at: new Date().toISOString() };
}

export async function getPlanCourses(planId) {
  const rows = loadRows().filter((r) => r.plan_id === 1);
  return rows.map(toApiRow).filter(Boolean);
}

export async function getTransferCredits(planId) {
  return DEFAULT_TRANSFER_CREDITS;
}

export async function addCourseToPlan(planId, courseId, year, term) {
  const rows = loadRows();
  const alreadyIn = rows.find((r) => r.plan_id === 1 && r.course_id === courseId);
  if (alreadyIn) return { error: 'Course already in this plan' };
  const id = nextId();
  rows.push({ id, plan_id: 1, course_id: parseInt(courseId), semester_year: parseInt(year), semester_term: term, planned_credits: null });
  saveRows(rows);
  return { plan_course_id: id };
}

export async function moveCourse(planId, pcId, year, term) {
  const rows = loadRows();
  const row = rows.find((r) => r.id === parseInt(pcId));
  if (row) { row.semester_year = parseInt(year); row.semester_term = term; saveRows(rows); }
  return { ok: true };
}

export async function adjustCredits(planId, pcId, credits) {
  const rows = loadRows();
  const row = rows.find((r) => r.id === parseInt(pcId));
  if (row) { row.planned_credits = parseInt(credits); saveRows(rows); }
  return { ok: true };
}

export async function removeCourse(planId, pcId) {
  const rows = loadRows().filter((r) => r.id !== parseInt(pcId));
  saveRows(rows);
  return { ok: true };
}

export async function validatePlan(planId) {
  const planCourses = (await getPlanCourses(planId));
  const termOrder = { Fall: 1, Winter: 2, Spring: 3 };
  const semKey = (y, t) => y * 10 + (termOrder[t] ?? 9);
  const issues = [];
  for (const pc of planCourses) {
    for (const prereqCode of pc.course.prerequisites) {
      const prereq = planCourses.find((p) => p.course.code === prereqCode);
      if (!prereq) {
        issues.push({ code: pc.course.code, issue: `Prerequisite ${prereqCode} is not in your plan.` });
      } else if (semKey(prereq.semester_year, prereq.semester_term) >= semKey(pc.semester_year, pc.semester_term)) {
        issues.push({ code: pc.course.code, issue: `${prereqCode} must be taken before ${pc.course.code}.` });
      }
    }
  }
  return { valid: issues.length === 0, issues };
}
